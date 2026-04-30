import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Páginas
import Home from './pages/Home'
import Calculadora from './pages/Calculadora'
import Recetas from './pages/Recetas'
import RecetaDetalle from './pages/RecetaDetalle'
import Aprendizaje from './pages/Aprendizaje'
import AprendizajeDetalle from './pages/AprendizajeDetalle'
import Quiz from './pages/Quiz'
import Progreso from './pages/Progreso'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Acerca from './pages/Acerca'
import Juego from './pages/Juego'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rutas públicas */}
            <Route index element={<Home />} />
            <Route path="calculadora" element={<Calculadora />} />
            <Route path="recetas" element={<Recetas />} />
            <Route path="recetas/:id" element={<RecetaDetalle />} />
            <Route path="aprendizaje" element={<Aprendizaje />} />
            <Route path="aprendizaje/:id" element={<AprendizajeDetalle />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="juego" element={<Juego />} />
            <Route path="acerca" element={<Acerca />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="perfil" element={<Perfil />} />
              <Route path="progreso" element={<Progreso />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
