import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, LogOut, Store } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"
import { useCart } from "../context/CartContext.jsx"

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const { cantidadTotal } = useCart()
  const navigate = useNavigate()

  const cerrarSesion = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="border-b border-marca-beigeOscuro bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-marca-azul">
          <Store size={26} />
          <span className="text-lg font-bold">SystemShop</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          <Link to="/" className="hover:text-marca-azul">
            Inicio
          </Link>
          <Link to="/catalogo" className="hover:text-marca-azul">
            Catalogo
          </Link>
          {usuario?.rol === "admin" && (
            <Link to="/admin" className="hover:text-marca-azul">
              Administracion
            </Link>
          )}
          {usuario?.rol === "cliente" && (
            <Link to="/cliente" className="hover:text-marca-azul">
              Mi cuenta
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/carrito" className="relative text-gray-600 hover:text-marca-azul">
            <ShoppingCart size={22} />
            {cantidadTotal > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-marca-azul text-xs text-white">
                {cantidadTotal}
              </span>
            )}
          </Link>

          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-600 sm:inline">{usuario.nombre}</span>
              <button
                onClick={cerrarSesion}
                className="flex items-center gap-1 rounded-md bg-marca-beige px-3 py-1.5 text-sm text-gray-700 hover:bg-marca-beigeOscuro"
              >
                <LogOut size={16} />
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-md bg-marca-azul px-3 py-1.5 text-sm text-white hover:bg-marca-azulClaro"
            >
              <User size={16} />
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
