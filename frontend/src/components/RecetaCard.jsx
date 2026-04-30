export default function RecetaCard({ receta, onClick }) {
  const dificultadColor = {
    facil: 'bg-green-100 text-green-700',
    media: 'bg-yellow-100 text-yellow-700',
    dificil: 'bg-red-100 text-red-700',
  }

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
    >
      {/* Imagen placeholder */}
      {receta.imagen_url ? (
        <img
          src={receta.imagen_url}
          alt={receta.nombre}
          className="w-full h-40 object-cover rounded-xl mb-4"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-mint-100 rounded-xl mb-4 flex items-center justify-center">
          <i className="fas fa-utensils text-3xl text-primary-400" />
        </div>
      )}

      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-warm-900 leading-snug">{receta.nombre}</h3>
        <span className={`badge shrink-0 ${dificultadColor[receta.dificultad] || 'bg-warm-100 text-warm-600'}`}>
          {receta.dificultad_display}
        </span>
      </div>

      <p className="text-sm text-warm-500 line-clamp-2 mb-3">{receta.descripcion_corta}</p>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-warm-500">
        <span><i className="fas fa-fire text-orange-400 mr-1" />{receta.calorias} kcal</span>
        <span><i className="fas fa-clock text-primary-400 mr-1" />{receta.tiempo_preparacion} min</span>
        <span><i className="fas fa-users text-mint-400 mr-1" />{receta.porciones} porc.</span>
      </div>

      {receta.es_popular && (
        <div className="mt-3">
          <span className="badge bg-yellow-50 text-yellow-600">
            <i className="fas fa-star mr-1 text-xs" /> Popular
          </span>
        </div>
      )}
    </div>
  )
}
