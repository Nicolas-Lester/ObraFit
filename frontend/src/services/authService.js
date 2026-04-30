import api from './api'

export const authService = {
  async login(username, password) {
    const { data } = await api.post('/auth/token/', { username, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  async registro(userData) {
    const { data } = await api.post('/auth/registro/', userData)
    return data
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}

export const usuariosService = {
  async getPerfil() {
    const { data } = await api.get('/usuarios/perfil/')
    return data
  },

  async updatePerfil(perfil) {
    const { data } = await api.patch('/usuarios/perfil/', perfil)
    return data
  },

  async calcular(formData) {
    const { data } = await api.post('/usuarios/calculadora/', formData)
    return data
  },

  async getHistorialCalculos() {
    const { data } = await api.get('/usuarios/calculos/')
    return data
  },

  async getFavoritos() {
    const { data } = await api.get('/usuarios/favoritos/')
    return data
  },

  async addFavorito(recetaId, recetaNombre) {
    const { data } = await api.post('/usuarios/favoritos/', {
      receta_id: recetaId,
      receta_nombre: recetaNombre,
    })
    return data
  },

  async removeFavorito(id) {
    await api.delete(`/usuarios/favoritos/${id}/`)
  },

  async getProgreso() {
    const { data } = await api.get('/usuarios/progreso/')
    return data
  },

  async getLogros() {
    const { data } = await api.get('/usuarios/logros/')
    return data
  },
}
