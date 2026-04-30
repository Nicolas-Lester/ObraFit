import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/calculadora', label: 'Calculadora' },
    { to: '/recetas', label: 'Recetas' },
    { to: '/aprendizaje', label: 'Aprender' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/juego', label: '🎮 Juego' },
  ]

  return (
    <nav className="bg-white border-b border-warm-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary-600">
            <span className="text-2xl">🏗️</span>
            <span>ObraFit</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-warm-600 hover:text-warm-900 hover:bg-warm-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Auth desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 text-sm text-warm-700 hover:text-primary-600 transition-colors"
                >
                  <span className="text-lg">{user.avatar || '👤'}</span>
                  <span className="font-medium">{user.first_name || user.username}</span>
                </Link>
                <Link to="/progreso" className="btn-secondary text-sm py-1.5 px-4">
                  Progreso
                </Link>
                <button onClick={handleLogout} className="text-sm text-warm-500 hover:text-red-500 transition-colors">
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn-primary text-sm py-1.5 px-4">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-warm-600 hover:bg-warm-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-warm-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-warm-600'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-warm-100">
            {user ? (
              <>
                <Link to="/perfil" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-warm-700">
                  👤 {user.first_name || user.username}
                </Link>
                <Link to="/progreso" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-warm-600">
                  Progreso
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-500">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-primary-600">
                  Iniciar sesión
                </Link>
                <Link to="/registro" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-mint-600">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
