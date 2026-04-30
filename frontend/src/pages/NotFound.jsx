import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="text-6xl mb-4">🏗️</div>
      <h1 className="font-display text-5xl font-extrabold text-warm-800 mb-2">404</h1>
      <p className="text-xl text-warm-500 mb-6">Esta página está en construcción... o no existe.</p>
      <Link to="/" className="btn-primary">
        <i className="fas fa-home mr-2" /> Volver al inicio
      </Link>
    </div>
  )
}
