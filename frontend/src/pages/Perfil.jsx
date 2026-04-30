import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usuariosService } from '../services/authService'
import Spinner from '../components/Spinner'

export default function Perfil() {
  const { user, refreshUser } = useAuth()
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGuardar = async () => {
    setLoading(true)
    setError('')
    setMensaje('')
    try {
      await usuariosService.updatePerfil(form)
      await refreshUser()
      setMensaje('Perfil actualizado correctamente.')
      setEditando(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar los cambios.')
    } finally {
      setLoading(false)
    }
  }

  const perfil = user?.perfil

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{perfil?.avatar || '👷'}</div>
        <h1 className="font-display text-2xl font-bold text-warm-900">
          {user?.first_name || user?.username}
        </h1>
        <p className="text-warm-500 text-sm">@{user?.username}</p>
        <div className="flex justify-center gap-4 mt-3">
          <span className="badge bg-yellow-50 text-yellow-600">⭐ {perfil?.puntos_totales || 0} pts</span>
          <span className="badge bg-primary-50 text-primary-600">Nivel {perfil?.nivel || 1}</span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-warm-900">Información personal</h2>
          {!editando && (
            <button onClick={() => setEditando(true)} className="text-sm text-primary-500 hover:underline flex items-center gap-1.5">
              <i className="fas fa-pen text-xs" /> Editar
            </button>
          )}
        </div>

        {editando ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre</label>
                <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">Apellido</label>
                <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="flex gap-3">
              <button onClick={handleGuardar} disabled={loading} className="btn-primary">
                {loading ? <Spinner size="sm" /> : 'Guardar cambios'}
              </button>
              <button onClick={() => setEditando(false)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {mensaje && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg flex items-center gap-2">
                <i className="fas fa-check-circle" /> {mensaje}
              </div>
            )}
            {[
              { label: 'Nombre', value: `${user?.first_name || '—'} ${user?.last_name || ''}`.trim() },
              { label: 'Usuario', value: user?.username },
              { label: 'Email', value: user?.email || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-warm-50 last:border-0">
                <span className="text-warm-400 font-medium">{label}</span>
                <span className="text-warm-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="card mt-4">
        <h2 className="font-display font-semibold text-lg text-warm-900 mb-4">Estadísticas</h2>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-warm-50 rounded-xl p-3">
            <div className="text-xl font-bold text-primary-600">{perfil?.total_calculos || 0}</div>
            <div className="text-warm-500 text-xs mt-0.5">Cálculos</div>
          </div>
          <div className="bg-warm-50 rounded-xl p-3">
            <div className="text-xl font-bold text-mint-600">{perfil?.total_favoritos || 0}</div>
            <div className="text-warm-500 text-xs mt-0.5">Favoritas</div>
          </div>
          <div className="bg-warm-50 rounded-xl p-3">
            <div className="text-xl font-bold text-yellow-600">{perfil?.total_logros || 0}</div>
            <div className="text-warm-500 text-xs mt-0.5">Logros</div>
          </div>
        </div>
      </div>
    </div>
  )
}
