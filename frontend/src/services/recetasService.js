import api from './api'

export const recetasService = {
  async getCategorias() {
    const { data } = await api.get('/categorias/')
    return data
  },

  async getRecetas(params = {}) {
    const { data } = await api.get('/recetas/', { params })
    return data
  },

  async getReceta(id) {
    const { data } = await api.get(`/recetas/${id}/`)
    return data
  },

  async getContenido(params = {}) {
    const { data } = await api.get('/aprendizaje/', { params })
    return data
  },

  async getContenidoDetalle(id) {
    const { data } = await api.get(`/aprendizaje/${id}/`)
    return data
  },

  async getQuizPreguntas() {
    const { data } = await api.get('/quiz/')
    return data
  },

  async enviarResultadoQuiz(respuestas) {
    const { data } = await api.post('/quiz/resultado/', { respuestas })
    return data
  },
}
