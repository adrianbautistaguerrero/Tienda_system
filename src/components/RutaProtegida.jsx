import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

// Protege rutas. Si se pasa "rol", ademas verifica que el usuario tenga ese rol.
export default function RutaProtegida({ children, rol }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return <div className="p-10 text-center">Cargando...</div>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace />
  }

  return children
}
