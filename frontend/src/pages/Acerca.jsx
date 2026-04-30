import { Link } from 'react-router-dom'

export default function Acerca() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-in">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🏗️</div>
        <h1 className="font-display text-3xl font-bold text-warm-900">Acerca de ObraFit</h1>
        <p className="text-warm-500 mt-2">Bienestar y nutrición para la fuerza laboral de Chile</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-warm-900 mb-3">¿Qué es ObraFit?</h2>
          <p className="text-warm-600 leading-relaxed">
            ObraFit es una plataforma digital de bienestar y nutrición diseñada especialmente para los trabajadores de la construcción en Chile. Nuestra misión es promover hábitos alimenticios saludables, adaptados a la intensidad física del trabajo en obra.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-lg text-warm-900 mb-4">¿Qué ofrecemos?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🧮', title: 'Calculadora Nutricional', desc: 'Basada en la fórmula Harris-Benedict para calcular tus necesidades calóricas reales.' },
              { icon: '🍽️', title: '500+ Recetas', desc: 'Recetas chilenas saludables, económicas y fáciles de preparar con valores nutricionales.' },
              { icon: '📚', title: 'Modo Aprendizaje', desc: 'Artículos y tips sobre nutrición, salud laboral y bienestar.' },
              { icon: '🏆', title: 'Gamificación', desc: 'Sistema de puntos, niveles y logros para mantenerte motivado.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <p className="font-medium text-warm-800 text-sm">{title}</p>
                  <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-lg text-warm-900 mb-3">Stack tecnológico</h2>
          <div className="flex flex-wrap gap-2">
            {['Django REST Framework', 'React 18', 'Vite', 'TailwindCSS', 'PostgreSQL', 'Docker', 'JWT Auth'].map((t) => (
              <span key={t} className="badge bg-warm-100 text-warm-600">{t}</span>
            ))}
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-warm-400 text-sm mb-4">Hecho con ❤️ en Chile 🇨🇱</p>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
