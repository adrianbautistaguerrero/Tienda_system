import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios.js"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Al iniciar, recupera la sesion guardada en localStorage.
  useEffect(() => {
    const guardado = localStorage.getItem("usuario")
    if (guardado) {
      setUsuario(JSON.parse(guardado))
    }
    setCargando(false)
  }, [])

  // Inicia sesion contra la API y guarda token + datos del usuario.
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login.php", { email, password })
    localStorage.setItem("token", data.token)
    localStorage.setItem("usuario", JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data.usuario
  }

  // Registra un nuevo usuario (rol cliente por defecto en el backend).
  const registro = async (nombre, email, password) => {
    const { data } = await api.post("/auth/registro.php", { nombre, email, password })
    return data
  }

  // Cierra sesion limpiando el almacenamiento local.
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
