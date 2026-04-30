import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService, usuariosService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPerfil = useCallback(async () => {
    try {
      const perfil = await usuariosService.getPerfil()
      setUser(perfil)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchPerfil().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchPerfil])

  const login = async (username, password) => {
    await authService.login(username, password)
    await fetchPerfil()
  }

  const registro = async (userData) => {
    await authService.registro(userData)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const refreshUser = fetchPerfil

  return (
    <AuthContext.Provider value={{ user, loading, login, registro, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
