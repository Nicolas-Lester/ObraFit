import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '🧮', title: 'Calculadora', desc: 'Calcula tus calorías diarias con la fórmula Harris-Benedict.', link: '/calculadora', color: 'from-blue-500 to-sky-400' },
  { icon: '🍽️', title: 'Recetas', desc: '+500 recetas chilenas con valores nutricionales completos.', link: '/recetas', color: 'from-orange-400 to-amber-400' },
  { icon: '📚', title: 'Aprender', desc: 'Artículos y tips de nutrición para mejorar tus hábitos.', link: '/aprendizaje', color: 'from-mint-500 to-teal-500' },
  { icon: '🎯', title: 'Quiz', desc: 'Pon a prueba tus conocimientos y gana puntos.', link: '/quiz', color: 'from-violet-500 to-purple-500' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-mint-500 text-white">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/25 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
            🏗️ Plataforma de bienestar para obreros
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Bienvenido a{' '}
            <span className="text-yellow-300 drop-shadow-sm">ObraFit</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            La plataforma de nutrición diseñada para trabajadores de la construcción en Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <>
                <Link to="/calculadora" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all shadow-xl text-base active:scale-95">
                  Ir a mi Calculadora
                </Link>
                <Link to="/perfil" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
                  Ver mi Perfil
                </Link>
              </>
            ) : (
              <>
                <Link to="/registro" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all shadow-xl text-base active:scale-95">
                  Comenzar gratis
                </Link>
                <Link to="/calculadora" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
                  Probar calculadora
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '500+', label: 'Recetas chilenas', icon: '🍽️' },
              { value: '10+',  label: 'Logros',           icon: '🏆' },
              { value: '100%', label: 'Gratuito',         icon: '✅' },
              { value: '24/7', label: 'Disponible',       icon: '🌐' },
            ].map(({ value, label, icon }) => (
              <div key={label}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-display font-extrabold bg-gradient-to-r from-primary-600 to-mint-500 bg-clip-text text-transparent">{value}</div>
                <div className="text-xs text-warm-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Características ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-warm-900">Todo lo que necesitas</h2>
          <p className="text-warm-500 mt-1.5">Herramientas diseñadas para tu bienestar en el trabajo</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon, title, desc, link, color }) => (
            <Link key={link} to={link}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} rounded-t-2xl`} />
              <div className="text-4xl mb-3 mt-1">{icon}</div>
              <h3 className="font-display font-bold text-warm-900 mb-1.5 group-hover:text-primary-600 transition-colors text-lg">{title}</h3>
              <p className="text-sm text-warm-500 leading-relaxed">{desc}</p>
              <span className="inline-block mt-3 text-xs font-semibold text-primary-500 group-hover:translate-x-1 transition-transform">
                Ver más →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Minijuego CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Link to="/juego"
          className="group relative overflow-hidden flex rounded-3xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 text-white p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl opacity-20 group-hover:opacity-30 transition-opacity select-none pointer-events-none">
            👷
          </div>
          <div className="absolute right-24 bottom-2 text-3xl opacity-15 select-none pointer-events-none">🥦</div>
          <div className="absolute right-40 top-3 text-2xl opacity-15 select-none pointer-events-none">🍎</div>
          <div className="relative">
            <span className="inline-block bg-white/20 border border-white/30 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              🎮 Minijuego
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-2">ObraFit Rush</h2>
            <p className="text-sky-100 max-w-md text-sm mb-4">
              ¡Mueve al obrero y atrapa los alimentos saludables! Esquiva la comida chatarra para ganar puntos y subir de nivel.
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-sky-600 font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg group-hover:bg-sky-50 transition-colors active:scale-95">
              ¡Jugar ahora! →
            </span>
          </div>
        </Link>
      </section>

      {/* ── CTA Registro ── */}
      {!user && (
        <section className="bg-gradient-to-r from-mint-600 to-primary-600 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center text-white">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-3">Sistema de logros y puntos</h2>
            <p className="text-mint-100 mb-7 text-base max-w-lg mx-auto">
              Regístrate gratis y desbloquea logros mientras mejoras tu alimentación. ¡Gana puntos, sube de nivel!
            </p>
            <Link to="/registro"
              className="inline-block bg-white text-mint-700 font-extrabold px-10 py-3.5 rounded-2xl hover:bg-mint-50 transition-all shadow-xl active:scale-95 text-base">
              Crear cuenta gratis
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
