import { useState, useEffect } from 'react'
import { usuariosService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function Progreso() {
  const { user } = useAuth()
  const [calculos, setCalculos] = useState([])
  const [progreso, setProgreso] = useState([])
  const [logros, setLogros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      usuariosService.getHistorialCalculos(),
      usuariosService.getProgreso(),
      usuariosService.getLogros(),
    ]).then(([c, p, l]) => {
      setCalculos(c.results || c)
      setProgreso(p.results || p)
      setLogros(l.results || l)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" className="py-20" />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">📊</div>
        <h1 className="font-display text-3xl font-bold text-warm-900">Mi Progreso</h1>
        <p className="text-warm-500 mt-1">Hola, {user?.first_name || user?.username} 👋</p>
      </div>

      {/* Puntos y nivel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '⭐', label: 'Puntos totales', value: user?.perfil?.puntos_totales ?? 0, color: 'from-yellow-400 to-orange-400' },
          { icon: '🏅', label: 'Nivel', value: user?.perfil?.nivel ?? 1, color: 'from-primary-400 to-primary-600' },
          { icon: '🏆', label: 'Logros', value: logros.filter((l) => l.desbloqueado).length, color: 'from-mint-400 to-mint-600' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className={`bg-gradient-to-r ${color} text-white rounded-2xl p-5 text-center`}>
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-3xl font-display font-extrabold">{value}</div>
            <div className="text-white/80 text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historial cálculos */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <i className="fas fa-calculator text-primary-400" /> Historial Nutricional
          </h2>
          {calculos.length === 0 ? (
            <p className="text-sm text-warm-400 py-4 text-center">Aún no tienes cálculos guardados. Ve a la <a href="/calculadora" className="text-primary-500 hover:underline">calculadora</a>.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {calculos.map((c) => (
                <div key={c.id} className="bg-warm-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-medium text-warm-800">{c.objetivo_display}</span>
                    <span className="font-bold text-primary-600">{c.calorias_diarias} kcal</span>
                  </div>
                  <div className="text-xs text-warm-500 flex gap-3">
                    <span>{c.peso} kg / {c.altura} cm</span>
                    <span>{c.edad} años</span>
                    <span>{c.nivel_actividad_display}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logros */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <i className="fas fa-trophy text-yellow-400" /> Logros
          </h2>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {logros.map((l) => (
              <div
                key={l.id}
                className={`rounded-xl p-3 text-center text-sm transition-opacity ${
                  l.desbloqueado ? 'bg-yellow-50 border border-yellow-200' : 'bg-warm-50 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{l.icono}</div>
                <div className="font-medium text-warm-800 text-xs leading-tight">{l.nombre}</div>
                {l.desbloqueado && <div className="text-xs text-yellow-600 mt-0.5">+{l.puntos} pts</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Lecciones completadas */}
        <div className="card lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <i className="fas fa-graduation-cap text-mint-400" /> Aprendizaje completado
          </h2>
          {progreso.length === 0 ? (
            <p className="text-sm text-warm-400 py-4 text-center">
              Completa artículos y quizzes para ver tu progreso aquí.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {progreso.map((p) => (
                <span key={p.id} className="badge bg-mint-50 text-mint-700 border border-mint-200">
                  <i className="fas fa-check mr-1 text-xs" /> Lección #{p.leccion_id}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
