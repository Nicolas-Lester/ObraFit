import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recetasService } from '../services/recetasService'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function Quiz() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [preguntas, setPreguntas] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    recetasService.getQuizPreguntas()
      .then((data) => setPreguntas(data.results || data))
      .finally(() => setLoading(false))
  }, [])

  const handleRespuesta = (pregId, opcion) => {
    setRespuestas((prev) => ({ ...prev, [pregId]: opcion }))
  }

  const handleSiguiente = () => {
    if (current < preguntas.length - 1) setCurrent((c) => c + 1)
  }

  const handleAnterior = () => {
    if (current > 0) setCurrent((c) => c - 1)
  }

  const handleEnviar = async () => {
    setEnviando(true)
    try {
      const data = await recetasService.enviarResultadoQuiz({ respuestas })
      setResultado(data)
    } catch {
      alert('Error al enviar el quiz. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <Spinner size="lg" className="py-20" />

  if (resultado) {
    const pct = Math.round((resultado.correctas / resultado.total) * 100)
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="text-6xl mb-4">{pct >= 70 ? '🏆' : pct >= 50 ? '💪' : '📖'}</div>
        <h2 className="font-display text-2xl font-bold text-warm-900 mb-2">
          {resultado.correctas} / {resultado.total} correctas
        </h2>
        <div className="text-5xl font-extrabold text-primary-600 mb-1">{pct}%</div>
        <p className="text-warm-500 mb-6">
          {pct >= 70 ? '¡Excelente resultado!' : pct >= 50 ? '¡Buen trabajo!' : 'Sigue aprendiendo y vuelve a intentarlo.'}
        </p>

        {resultado.puntos_ganados > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-3 mb-6 text-yellow-700 font-medium">
            🌟 +{resultado.puntos_ganados} puntos ganados
          </div>
        )}

        {resultado.logros_desbloqueados?.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-xl px-6 py-4 mb-6 text-left">
            <p className="font-semibold text-primary-700 mb-2">🎯 Logros desbloqueados:</p>
            {resultado.logros_desbloqueados.map((l) => (
              <div key={l} className="text-sm text-primary-600">• {l}</div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={() => { setResultado(null); setRespuestas({}); setCurrent(0); setLoading(true); recetasService.getQuizPreguntas().then((d) => setPreguntas(d.results || d)).finally(() => setLoading(false)) }}
            className="btn-primary">
            Intentar otra vez
          </button>
          <button onClick={() => navigate('/aprendizaje')} className="btn-secondary">
            Seguir aprendiendo
          </button>
        </div>
      </div>
    )
  }

  if (preguntas.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-warm-500">
        <i className="fas fa-question-circle text-4xl text-warm-200 block mb-3" />
        No hay preguntas disponibles aún.
      </div>
    )
  }

  const pregunta = preguntas[current]
  const totalRespondidas = Object.keys(respuestas).length

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎯</div>
        <h1 className="font-display text-2xl font-bold text-warm-900">Quiz Nutricional</h1>
        <p className="text-warm-500 text-sm mt-1">{totalRespondidas} de {preguntas.length} respondidas</p>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-warm-100 rounded-full h-2 mb-6">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(totalRespondidas / preguntas.length) * 100}%` }}
        />
      </div>

      <div className="card">
        <p className="text-xs text-warm-400 mb-2">Pregunta {current + 1} de {preguntas.length}</p>
        <h2 className="font-semibold text-warm-900 mb-5 leading-relaxed">{pregunta.pregunta}</h2>

        <div className="space-y-3">
          {['a', 'b', 'c', 'd'].map((op) => {
            const texto = pregunta[`opcion_${op}`]
            if (!texto) return null
            const seleccionada = respuestas[pregunta.id] === op
            return (
              <button
                key={op}
                onClick={() => handleRespuesta(pregunta.id, op)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  seleccionada
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-warm-200 text-warm-700 hover:border-primary-300'
                }`}
              >
                <span className="font-bold mr-2 text-warm-400">{op.toUpperCase()}.</span>
                {texto}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <button onClick={handleAnterior} disabled={current === 0} className="btn-secondary disabled:opacity-40">
          <i className="fas fa-arrow-left mr-1.5" /> Anterior
        </button>
        {current < preguntas.length - 1 ? (
          <button onClick={handleSiguiente} className="btn-primary">
            Siguiente <i className="fas fa-arrow-right ml-1.5" />
          </button>
        ) : (
          <button
            onClick={handleEnviar}
            disabled={enviando || totalRespondidas < preguntas.length}
            className="btn-mint disabled:opacity-50"
          >
            {enviando ? <Spinner size="sm" /> : 'Enviar quiz'}
          </button>
        )}
      </div>
    </div>
  )
}
