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
    const emoji = pct >= 70 ? '🏆' : pct >= 50 ? '💪' : '📖'
    const msg = pct >= 70 ? '¡Excelente resultado!' : pct >= 50 ? '¡Buen trabajo!' : 'Sigue aprendiendo y vuelve a intentarlo.'
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
          <div className="text-7xl mb-4">{emoji}</div>
          <h2 className="font-display text-2xl font-extrabold text-warm-900 mb-1">{msg}</h2>
          <div className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-mint-500 bg-clip-text text-transparent my-3">{pct}%</div>
          <p className="text-warm-400 mb-1 text-sm">{resultado.correctas} de {resultado.total} correctas</p>

          {/* Barra resultado */}
          <div className="w-full bg-gray-100 rounded-full h-3 my-4 overflow-hidden">
            <div className={`h-3 rounded-full transition-all duration-700 ${pct >= 70 ? 'bg-gradient-to-r from-emerald-400 to-mint-500' : pct >= 50 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gradient-to-r from-red-400 to-orange-400'}`}
              style={{ width: `${pct}%` }} />
          </div>

          {resultado.puntos_ganados > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 mb-4 text-yellow-700 font-semibold text-sm">
              🌟 +{resultado.puntos_ganados} puntos ganados
            </div>
          )}

          {resultado.logros_desbloqueados?.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl px-5 py-4 mb-4 text-left">
              <p className="font-bold text-primary-700 mb-2 text-sm">🎯 Logros desbloqueados:</p>
              {resultado.logros_desbloqueados.map((l) => (
                <div key={l} className="text-sm text-primary-600">• {l}</div>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-center mt-4">
            <button onClick={() => {
              setResultado(null); setRespuestas({}); setCurrent(0); setLoading(true)
              recetasService.getQuizPreguntas().then((d) => setPreguntas(d.results || d)).finally(() => setLoading(false))
            }} className="btn-primary text-sm px-6 py-2.5">
              Intentar otra vez
            </button>
            <button onClick={() => navigate('/aprendizaje')}
              className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-warm-600 font-semibold text-sm hover:border-primary-300 transition-all">
              Seguir aprendiendo
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (preguntas.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-warm-500">
        <div className="text-5xl mb-4 opacity-30">❓</div>
        <p className="text-warm-500">No hay preguntas disponibles aún.</p>
      </div>
    )
  }

  const pregunta = preguntas[current]
  const totalRespondidas = Object.keys(respuestas).length
  const progPct = Math.round((totalRespondidas / preguntas.length) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block bg-primary-50 text-primary-600 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
          🎯 Quiz Nutricional
        </span>
        <h1 className="font-display text-2xl font-extrabold text-warm-900">Pon a prueba tu saber</h1>
        <p className="text-warm-400 text-sm mt-1">{totalRespondidas} de {preguntas.length} respondidas</p>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-warm-100 rounded-full h-2.5 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-mint-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progPct}%` }}
        />
      </div>

      {/* Card pregunta */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary-100 text-primary-600 font-bold text-xs px-2.5 py-1 rounded-lg">
            {current + 1} / {preguntas.length}
          </span>
        </div>
        <h2 className="font-display font-bold text-warm-900 text-lg mb-5 leading-relaxed">{pregunta.pregunta}</h2>

        <div className="space-y-2.5">
          {['a', 'b', 'c', 'd'].map((op) => {
            const texto = pregunta[`opcion_${op}`]
            if (!texto) return null
            const seleccionada = respuestas[pregunta.id] === op
            return (
              <button
                key={op}
                onClick={() => handleRespuesta(pregunta.id, op)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                  seleccionada
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-gray-100 bg-gray-50 text-warm-700 hover:border-primary-300 hover:bg-primary-50/30'
                }`}
              >
                <span className={`inline-block w-6 h-6 text-xs font-extrabold rounded-md mr-3 text-center leading-6 ${
                  seleccionada ? 'bg-primary-500 text-white' : 'bg-gray-200 text-warm-500'
                }`}>
                  {op.toUpperCase()}
                </span>
                {texto}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <button onClick={handleAnterior} disabled={current === 0}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-warm-600 font-semibold text-sm hover:border-primary-300 hover:text-primary-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          ← Anterior
        </button>
        {current < preguntas.length - 1 ? (
          <button onClick={handleSiguiente} className="btn-primary px-6 py-2.5 text-sm">
            Siguiente →
          </button>
        ) : (
          <button
            onClick={handleEnviar}
            disabled={enviando || totalRespondidas < preguntas.length}
            className="bg-gradient-to-r from-mint-500 to-primary-500 text-white font-bold px-6 py-2.5 rounded-xl hover:from-mint-600 hover:to-primary-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-95">
            {enviando ? '⏳ Enviando…' : '✅ Enviar quiz'}
          </button>
        )}
      </div>
    </div>
  )
}
