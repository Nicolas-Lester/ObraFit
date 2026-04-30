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
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-mint-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="text-5xl mb-4">🏗️</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Bienvenido a <span className="text-yellow-300">ObraFit</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            La plataforma de bienestar y nutrición diseñada especialmente para trabajadores de la construcción en Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <>
                <Link to="/calculadora" className="bg-white text-primary-600 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                  Ir a mi Calculadora
                </Link>
                <Link to="/perfil" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  Ver mi Perfil
                </Link>
              </>
            ) : (
              <>
                <Link to="/registro" className="bg-white text-primary-600 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                  Comenzar gratis
                </Link>
                <Link to="/calculadora" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  Probar calculadora
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats rápidas */}
      <section className="bg-white border-b border-warm-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Recetas chilenas' },
              { value: '10+', label: 'Logros disponibles' },
              { value: '100%', label: 'Gratuito' },
              { value: '24/7', label: 'Disponible' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-display font-extrabold text-primary-600">{value}</div>
                <div className="text-sm text-warm-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-warm-900 mb-2">
          Todo lo que necesitas
        </h2>
        <p className="text-center text-warm-500 mb-10">Herramientas diseñadas para tu bienestar en el trabajo</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc, link }) => (
            <Link key={link} to={link} className="card group hover:border-primary-200 hover:-translate-y-1 transition-all duration-200">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-display font-semibold text-warm-900 mb-2 group-hover:text-primary-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-warm-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA gamificación */}
      {!user && (
        <section className="bg-gradient-to-r from-mint-500 to-primary-500 py-14">
          <div className="max-w-2xl mx-auto px-4 text-center text-white">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="font-display text-2xl font-bold mb-3">Sistema de logros y puntos</h2>
            <p className="text-mint-100 mb-6">
              Regístrate gratis y desbloquea logros mientras mejoras tu alimentación. ¡Gana puntos, sube de nivel y lleva un registro de tu progreso!
            </p>
            <Link to="/registro" className="bg-white text-mint-600 font-bold px-8 py-3 rounded-xl hover:bg-mint-50 transition-colors shadow-lg inline-block">
              Crear cuenta gratis
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
