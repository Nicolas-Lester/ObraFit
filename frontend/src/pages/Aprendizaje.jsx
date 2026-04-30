import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { recetasService } from '../services/recetasService'
import Spinner from '../components/Spinner'

const FA_MAP = {
  'fa-hard-hat': '👷', 'fa-tint': '💧', 'fa-drumstick-bite': '🍗',
  'fa-egg': '🥚', 'fa-hamburger': '🍔', 'fa-pizza-slice': '🍕',
  'fa-cookie-bite': '🍪', 'fa-apple-alt': '🍎', 'fa-carrot': '🥕',
  'fa-fish': '🐟', 'fa-bread-slice': '🍞', 'fa-seedling': '🌱',
  'fa-running': '🏃', 'fa-dumbbell': '💪', 'fa-heart': '❤️',
  'fa-brain': '🧠', 'fa-utensils': '🍽️', 'fa-weight': '⚖️',
  'fa-leaf': '🌿', 'fa-fire': '🔥', 'fa-bolt': '⚡',
  'fa-sun': '☀️', 'fa-moon': '🌙', 'fa-water': '💧',
}
const getIcon = (icono) => {
  if (!icono) return '📄'
  if (icono.startsWith('fa-')) return FA_MAP[icono] || '📖'
  return icono
}

export default function Aprendizaje() {
  const navigate = useNavigate()
  const [articulos, setArticulos] = useState([])
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      recetasService.getContenido({ tipo: 'articulo' }),
      recetasService.getContenido({ tipo: 'tip' }),
    ]).then(([arts, tps]) => {
      setArticulos(arts.results || arts)
      setTips(tps.results || tps)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" className="py-20" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <div className="text-4xl mb-2">📚</div>
        <h1 className="font-display text-3xl font-bold text-warm-900">Modo Aprendizaje</h1>
        <p className="text-warm-500 mt-1">Artículos y consejos de nutrición para mejorar tu salud</p>
      </div>

      {/* CTA Quiz */}
      <div className="bg-gradient-to-r from-primary-500 to-mint-500 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div>
          <h2 className="font-display font-bold text-xl mb-1">🎯 ¿Listo para el quiz?</h2>
          <p className="text-primary-100 text-sm">Pon a prueba tus conocimientos y gana puntos</p>
        </div>
        <Link to="/quiz" className="bg-white text-primary-600 font-bold px-6 py-2.5 rounded-xl hover:bg-primary-50 transition-colors shrink-0">
          Hacer quiz
        </Link>
      </div>

      {/* Artículos */}
      {articulos.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-warm-900 mb-5 flex items-center gap-2">
            <span className="text-2xl">📖</span> Artículos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articulos.map((art) => (
              <div
                key={art.id}
                onClick={() => navigate(`/aprendizaje/${art.id}`)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 cursor-pointer"
              >
                <div className="h-28 bg-gradient-to-br from-primary-100 to-mint-100 flex items-center justify-center text-5xl">
                  {getIcon(art.icono)}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-warm-900 mb-1.5 group-hover:text-primary-600 transition-colors leading-snug">{art.titulo}</h3>
                  <p className="text-sm text-warm-500 line-clamp-2 mb-3 leading-relaxed">{art.descripcion}</p>
                  <div className="flex items-center justify-between text-xs text-warm-400">
                    <span>⏱ {art.duracion_lectura} min de lectura</span>
                    {art.es_destacado && <span className="badge bg-yellow-50 text-yellow-600 border border-yellow-100">⭐ Destacado</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-warm-900 mb-5 flex items-center gap-2">
            <span className="text-2xl">💡</span> Consejos Rápidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div key={tip.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-sm transition-all">
                <h3 className="font-display font-bold text-warm-800 mb-1.5 flex items-center gap-2">
                  <span>💡</span>{tip.titulo}
                </h3>
                <p className="text-sm text-warm-600 leading-relaxed">{tip.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
