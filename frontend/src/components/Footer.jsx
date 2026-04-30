import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg mb-3">
              <span className="text-2xl">🏗️</span>
              <span>ObraFit</span>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma de bienestar y nutrición para trabajadores de la construcción en Chile.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Navegación</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/calculadora', label: 'Calculadora' },
                { to: '/recetas', label: 'Recetas' },
                { to: '/aprendizaje', label: 'Aprender' },
                { to: '/quiz', label: 'Quiz' },
                { to: '/acerca', label: 'Acerca de' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Tecnología</h3>
            <ul className="space-y-1 text-sm">
              <li>React + Vite</li>
              <li>Django REST Framework</li>
              <li>PostgreSQL</li>
              <li>TailwindCSS</li>
              <li>Docker</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-warm-700 text-sm text-center text-warm-500">
          © {new Date().getFullYear()} ObraFit. Hecho con ❤️ en Chile.
        </div>
      </div>
    </footer>
  )
}
