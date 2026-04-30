import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recetasService } from '../services/recetasService'
import RecetaCard from '../components/RecetaCard'
import Spinner from '../components/Spinner'

export default function Recetas() {
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({ q: '', tipo: '', dificultad: '' })

  useEffect(() => {
    recetasService.getCategorias().then(setCategorias)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filtros.q) params.q = filtros.q
    if (filtros.tipo) params.tipo = filtros.tipo
    if (filtros.dificultad) params.dificultad = filtros.dificultad

    recetasService.getRecetas(params)
      .then((data) => setRecetas(data.results || data))
      .finally(() => setLoading(false))
  }, [filtros])

  const handleFiltro = (key, value) =>
    setFiltros((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }))

  const tiposComida = [
    { value: 'desayuno', label: '🌅 Desayuno' },
    { value: 'almuerzo', label: '☀️ Almuerzo' },
    { value: 'cena', label: '🌙 Cena' },
    { value: 'snack', label: '🍎 Snack' },
  ]

  const dificultades = [
    { value: 'facil', label: 'Fácil' },
    { value: 'media', label: 'Media' },
    { value: 'dificil', label: 'Difícil' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🍽️</div>
        <h1 className="font-display text-3xl font-bold text-warm-900">Recetas Saludables</h1>
        <p className="text-warm-500 mt-1">+500 recetas chilenas con valores nutricionales</p>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-xl mx-auto mb-6">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" />
        <input
          type="text"
          placeholder="Buscar recetas, ingredientes..."
          value={filtros.q}
          onChange={(e) => setFiltros((p) => ({ ...p, q: e.target.value }))}
          className="input-field pl-10"
        />
      </div>

      {/* Filtros tipo comida */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {tiposComida.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleFiltro('tipo', value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filtros.tipo === value
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-warm-600 border-warm-200 hover:border-primary-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filtros dificultad */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {dificultades.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleFiltro('dificultad', value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filtros.dificultad === value
                ? 'bg-mint-500 text-white border-mint-500'
                : 'bg-white text-warm-500 border-warm-200 hover:border-mint-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : recetas.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-30">🔍</div>
          <p className="text-warm-500 font-medium mb-2">No se encontraron recetas con esos filtros.</p>
          <button onClick={() => setFiltros({ q: '', tipo: '', dificultad: '' })}
            className="mt-2 text-primary-500 hover:text-primary-700 font-semibold text-sm underline underline-offset-2 transition-colors">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recetas.map((receta) => (
            <RecetaCard
              key={receta.id}
              receta={receta}
              onClick={() => navigate(`/recetas/${receta.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
