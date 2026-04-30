import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recetasService } from '../services/recetasService'
import Spinner from '../components/Spinner'

export default function AprendizajeDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contenido, setContenido] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recetasService.getContenidoDetalle(id)
      .then(setContenido)
      .catch(() => navigate('/aprendizaje'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <Spinner size="lg" className="py-20" />
  if (!contenido) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-warm-500 hover:text-warm-800 mb-6 text-sm">
        <i className="fas fa-arrow-left" /> Volver
      </button>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl"><i className={`fas ${contenido.icono}`} /></span>
          <div>
            <span className="badge bg-primary-50 text-primary-600 mb-1">{contenido.tipo_display}</span>
            <h1 className="font-display text-2xl font-bold text-warm-900">{contenido.titulo}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-warm-400 mb-6 pb-4 border-b border-warm-100">
          <span><i className="fas fa-clock mr-1" />{contenido.duracion_lectura} min de lectura</span>
        </div>

        <p className="text-warm-600 mb-6 leading-relaxed">{contenido.descripcion}</p>

        <div className="prose prose-sm max-w-none text-warm-700 leading-relaxed whitespace-pre-line">
          {contenido.contenido}
        </div>
      </div>
    </div>
  )
}
