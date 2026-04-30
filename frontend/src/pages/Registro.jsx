import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import Spinner from '../components/Spinner'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', password2: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await authService.registro(form)
      navigate('/login', { state: { mensaje: '¡Cuenta creada! Ahora puedes iniciar sesión.' } })
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: 'Error al registrar. Intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (name) => {
    const e = errors[name]
    if (!e) return null
    return <p className="text-xs text-red-500 mt-1">{Array.isArray(e) ? e[0] : e}</p>
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏗️</div>
          <h1 className="font-display text-2xl font-bold text-warm-900">Crea tu cuenta</h1>
          <p className="text-warm-500 text-sm mt-1">Gratis y sin tarjeta de crédito</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nombre</label>
                <input type="text" name="first_name" value={form.first_name} onChange={handleChange}
                  required placeholder="Juan" className="input-field" />
                {fieldError('first_name')}
              </div>
              <div>
                <label className="label">Apellido</label>
                <input type="text" name="last_name" value={form.last_name} onChange={handleChange}
                  placeholder="Pérez" className="input-field" />
                {fieldError('last_name')}
              </div>
            </div>

            <div>
              <label className="label">Usuario</label>
              <input type="text" name="username" value={form.username} onChange={handleChange}
                required autoComplete="username" placeholder="juan_perez" className="input-field" />
              {fieldError('username')}
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required autoComplete="email" placeholder="juan@ejemplo.cl" className="input-field" />
              {fieldError('email')}
            </div>

            <div>
              <label className="label">Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                required autoComplete="new-password" placeholder="••••••••" className="input-field" />
              {fieldError('password')}
            </div>

            <div>
              <label className="label">Confirmar contraseña</label>
              <input type="password" name="password2" value={form.password2} onChange={handleChange}
                required autoComplete="new-password" placeholder="••••••••" className="input-field" />
              {fieldError('password2')}
            </div>

            {(errors.non_field_errors || errors.detail) && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl">
                {errors.non_field_errors || errors.detail}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Spinner size="sm" /> : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-warm-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
