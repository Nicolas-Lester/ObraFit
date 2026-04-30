import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recetasService } from '../services/recetasService'
import { usuariosService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import RecetaCard from '../components/RecetaCard'

export default function RecetaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [receta, setReceta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [esFavorita, setEsFavorita] = useState(false)

  useEffect(() => {
    setLoading(true)
    recetasService.getReceta(id)
      .then(setReceta)
      .catch(() => navigate('/recetas'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const toggleFavorito = async () => {
    if (!user) { navigate('/login'); return }
    setGuardando(true)
    try {
      if (esFavorita) {
        const favs = await usuariosService.getFavoritos()
        const fav = favs.find((f) => f.receta_id === receta.id)
        if (fav) await usuariosService.removeFavorito(fav.id)
        setEsFavorita(false)
      } else {
        await usuariosService.addFavorito(receta.id, receta.nombre)
        setEsFavorita(true)
      }
    } finally {
      setGuardando(false)
    }
  }

  if (loading) return <Spinner size="lg" className="py-20" />
  if (!receta) return null

  const dificultadColor = { facil: 'bg-green-100 text-green-700', media: 'bg-yellow-100 text-yellow-700', dificil: 'bg-red-100 text-red-700' }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-warm-500 hover:text-warm-800 mb-6 text-sm">
        <i className="fas fa-arrow-left" /> Volver
      </button>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="font-display text-2xl font-bold text-warm-900">{receta.nombre}</h1>
              <span className={`badge shrink-0 ${dificultadColor[receta.dificultad]}`}>
                {receta.dificultad_display}
              </span>
            </div>
            <p className="text-warm-600 mb-4">{receta.descripcion}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-warm-500">
              <span><i className="fas fa-fire text-orange-400 mr-1.5" />{receta.calorias} kcal</span>
              <span><i className="fas fa-clock text-primary-400 mr-1.5" />{receta.tiempo_preparacion} min</span>
              <span><i className="fas fa-users text-mint-400 mr-1.5" />{receta.porciones} porciones</span>
              <span><i className="fas fa-tag text-warm-300 mr-1.5" />${receta.costo_aproximado}</span>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-2 min-w-fit">
            {[
              { label: 'Proteínas', value: receta.proteinas, color: 'bg-blue-50 text-blue-700' },
              { label: 'Carbos', value: receta.carbohidratos, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Grasas', value: receta.grasas, color: 'bg-orange-50 text-orange-700' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                <div className="text-lg font-bold">{value}g</div>
                <div className="text-xs opacity-80">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={toggleFavorito}
          disabled={guardando}
          className={`mt-4 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            esFavorita ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-warm-500 bg-warm-50 hover:bg-warm-100'
          }`}
        >
          <i className={`fas fa-heart ${esFavorita ? 'text-red-500' : 'text-warm-300'}`} />
          {esFavorita ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredientes */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <i className="fas fa-list text-primary-400" /> Ingredientes
          </h2>
          <ul className="space-y-2">
            {receta.ingredientes_lista?.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-warm-700">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Instrucciones */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <i className="fas fa-tasks text-mint-400" /> Preparación
          </h2>
          <ol className="space-y-3">
            {receta.instrucciones_lista?.map((paso, i) => (
              <li key={i} className="flex gap-3 text-sm text-warm-700">
                <span className="shrink-0 w-6 h-6 rounded-full bg-mint-500 text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {receta.tips && (
        <div className="card mt-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500" /> Tips
          </h3>
          <p className="text-sm text-yellow-700">{receta.tips}</p>
        </div>
      )}
    </div>
  )
}
