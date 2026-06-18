import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

export default function Registro() {
  const { registro } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await registro(nombre, email, password)
      setOk(true)
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo completar el registro.")
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-lg border border-marca-beigeOscuro bg-white p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Crear cuenta</h1>

        {ok && (
          <p className="mb-4 rounded-md bg-marca-beige px-3 py-2 text-sm text-marca-azul">
            Cuenta creada. Redirigiendo al inicio de sesion...
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none focus:border-marca-azul"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none focus:border-marca-azul"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Contrasena</label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none focus:border-marca-azul"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-marca-azul py-2.5 text-white hover:bg-marca-azulClaro"
          >
            Registrarme
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Ya tienes cuenta?{" "}
          <Link to="/login" className="text-marca-azul hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
