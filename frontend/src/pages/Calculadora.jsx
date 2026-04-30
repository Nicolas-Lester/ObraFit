import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usuariosService } from '../services/authService'
import Spinner from '../components/Spinner'

const ACTIVIDADES = [
  { value: 'sedentario', label: 'Sedentario (sin ejercicio)' },
  { value: 'ligero', label: 'Ligero (1-3 días/semana)' },
  { value: 'moderado', label: 'Moderado (3-5 días/semana)' },
  { value: 'activo', label: 'Activo (6-7 días/semana)' },
  { value: 'muy_activo', label: 'Muy activo (trabajo físico intenso)' },
]

const OBJETIVOS = [
  { value: 'perder', label: 'Perder peso' },
  { value: 'mantener', label: 'Mantener peso' },
  { value: 'ganar', label: 'Ganar músculo' },
]

export default function Calculadora() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    peso: '', altura: '', edad: '',
    genero: 'masculino', nivel_actividad: 'moderado', objetivo: 'mantener',
  })
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await usuariosService.calcular({
        ...form,
        peso: parseFloat(form.peso),
        altura: parseFloat(form.altura),
        edad: parseInt(form.edad),
      })
      setResultado(data)
      window.scrollTo({ top: document.getElementById('resultado')?.offsetTop - 80, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al calcular. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🧮</div>
        <h1 className="font-display text-3xl font-bold text-warm-900">Calculadora Nutricional</h1>
        <p className="text-warm-500 mt-1">Calcula tus necesidades calóricas diarias basadas en la fórmula Harris-Benedict</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-warm-900 mb-5">Tus datos</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Peso (kg)</label>
                <input type="number" name="peso" value={form.peso} onChange={handleChange}
                  required min="20" max="300" step="0.1" placeholder="70"
                  className="input-field" />
              </div>
              <div>
                <label className="label">Altura (cm)</label>
                <input type="number" name="altura" value={form.altura} onChange={handleChange}
                  required min="100" max="250" placeholder="175"
                  className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Edad (años)</label>
                <input type="number" name="edad" value={form.edad} onChange={handleChange}
                  required min="10" max="120" placeholder="30"
                  className="input-field" />
              </div>
              <div>
                <label className="label">Género</label>
                <select name="genero" value={form.genero} onChange={handleChange} className="input-field">
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Nivel de actividad</label>
              <select name="nivel_actividad" value={form.nivel_actividad} onChange={handleChange} className="input-field">
                {ACTIVIDADES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Objetivo</label>
              <div className="grid grid-cols-3 gap-2">
                {OBJETIVOS.map(({ value, label }) => (
                  <label key={value} className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-colors ${
                    form.objetivo === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-warm-200 text-warm-600 hover:border-warm-300'
                  }`}>
                    <input type="radio" name="objetivo" value={value} checked={form.objetivo === value}
                      onChange={handleChange} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Spinner size="sm" /> : 'Calcular mis calorías'}
            </button>

            {!user && (
              <p className="text-xs text-warm-400 text-center">
                <a href="/login" className="text-primary-500 hover:underline">Inicia sesión</a> para guardar tu historial de cálculos.
              </p>
            )}
          </form>
        </div>

        {/* Resultado */}
        <div id="resultado">
          {resultado ? (
            <div className="card animate-fade-in space-y-4">
              <h2 className="font-display font-semibold text-lg text-warm-900">Tu resultado</h2>

              <div className="bg-gradient-to-r from-primary-500 to-mint-500 text-white rounded-xl p-5 text-center">
                <div className="text-4xl font-display font-extrabold">{resultado.calorias_diarias}</div>
                <div className="text-primary-100 mt-1">kcal / día</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Proteínas', value: resultado.proteinas, unit: 'g', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Carbos', value: resultado.carbohidratos, unit: 'g', color: 'bg-yellow-50 text-yellow-700' },
                  { label: 'Grasas', value: resultado.grasas, unit: 'g', color: 'bg-orange-50 text-orange-700' },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                    <div className="text-xl font-bold">{value}<span className="text-xs font-normal ml-0.5">{unit}</span></div>
                    <div className="text-xs mt-0.5 opacity-80">{label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-warm-50 rounded-xl p-4 text-sm text-warm-600">
                <p className="font-medium text-warm-700 mb-1">TMB (metabolismo basal):</p>
                <p>{resultado.tmb} kcal/día sin actividad física</p>
              </div>

              {resultado.guardado && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <i className="fas fa-check-circle" />
                  ¡Cálculo guardado en tu perfil!
                </div>
              )}
            </div>
          ) : (
            <div className="card border-dashed flex flex-col items-center justify-center min-h-48 text-center text-warm-400">
              <i className="fas fa-calculator text-4xl mb-3 text-warm-200" />
              <p className="font-medium">Completa el formulario</p>
              <p className="text-sm mt-1">Tu resultado aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
