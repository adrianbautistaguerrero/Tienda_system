import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const usuario = await login(email, password)
      // Redirige segun el rol del usuario.
      navigate(usuario.rol === "admin" ? "/admin" : "/cliente")
    } catch (err) {
      setError("Email o contrasena incorrectos.")
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-lg border border-marca-beigeOscuro bg-white p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Iniciar sesion</h1>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={enviar} className="space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none focus:border-marca-azul"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-marca-azul py-2.5 text-white hover:bg-marca-azulClaro"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          No tienes cuenta?{" "}
          <Link to="/registro" className="text-marca-azul hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
