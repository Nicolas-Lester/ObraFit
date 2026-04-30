const tipoGradient = {
  desayuno: 'from-amber-400 to-orange-400',
  almuerzo: 'from-primary-400 to-sky-500',
  cena:     'from-violet-400 to-purple-500',
  snack:    'from-emerald-400 to-mint-500',
}

export default function RecetaCard({ receta, onClick }) {
  const dificultadStyle = {
    facil:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    media:   'bg-amber-50 text-amber-700 border border-amber-200',
    dificil: 'bg-red-50 text-red-700 border border-red-200',
  }
  const tipoComida = receta.categoria?.tipo_comida || 'almuerzo'
  const grad = tipoGradient[tipoComida] || tipoGradient.almuerzo

  return (
    <div onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 cursor-pointer">

      {/* Imagen / placeholder */}
      {receta.imagen_url ? (
        <img src={receta.imagen_url} alt={receta.nombre}
          className="w-full h-44 object-cover" loading="lazy" />
      ) : (
        <div className={`w-full h-44 bg-gradient-to-br ${grad} flex items-center justify-center`}>
          <span className="text-5xl opacity-80">🍽️</span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-bold text-warm-900 leading-snug text-sm group-hover:text-primary-600 transition-colors">
            {receta.nombre}
          </h3>
          <span className={`badge shrink-0 text-xs px-2 py-0.5 rounded-lg ${dificultadStyle[receta.dificultad] || 'bg-gray-100 text-gray-600'}`}>
            {receta.dificultad_display}
          </span>
        </div>

        <p className="text-xs text-warm-400 line-clamp-2 mb-3 leading-relaxed">{receta.descripcion_corta}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-warm-500 border-t border-gray-50 pt-2.5">
          <span className="flex items-center gap-1">
            <span className="text-orange-400">🔥</span>{receta.calorias} kcal
          </span>
          <span className="flex items-center gap-1">
            <span className="text-sky-400">⏱</span>{receta.tiempo_preparacion} min
          </span>
          {receta.es_popular && (
            <span className="ml-auto badge bg-yellow-50 text-yellow-600 border border-yellow-100 text-xs">
              ⭐ Popular
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
