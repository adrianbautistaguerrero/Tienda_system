import axios from "axios"

// La URL base de la API se toma de la variable de entorno VITE_API_URL.
// En desarrollo se usa el servidor PHP local por defecto.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor: agrega el token guardado a cada peticion si existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
