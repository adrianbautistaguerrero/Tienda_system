import { Link, useNavigate } from "react-router-dom"
import { Trash2, Minus, Plus } from "lucide-react"
import { useCart } from "../context/CartContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"

export default function Carrito() {
  const { items, eliminar, cambiarCantidad, total } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const irAPagar = () => {
    // Si no hay sesion, lo enviamos a login antes del pago.
    if (!usuario) navigate("/login")
    else navigate("/pago")
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Tu carrito esta vacio</h1>
        <Link
          to="/catalogo"
          className="mt-5 inline-block rounded-md bg-green 600 px-5 py-2.5 text-white hover:bg-marca-azulClaro"
        >
          Ir al catalogo
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Carrito de compras</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-marca-beigeOscuro rounded-lg border border-marca-beigeOscuro bg-white">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img
                  src={item.imagen || "/placeholder.svg"}
                  alt={item.nombre}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                  <p className="text-sm text-gray-500">${Number(item.precio).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                    className="rounded border border-marca-beigeOscuro p-1 text-gray-600 hover:bg-marca-beige"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center">{item.cantidad}</span>
                  <button
                    onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                    className="rounded border border-marca-beigeOscuro p-1 text-gray-600 hover:bg-marca-beige"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="w-20 text-right font-semibold text-gray-800">
                  ${(Number(item.precio) * item.cantidad).toFixed(2)}
                </p>
                <button
                  onClick={() => eliminar(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="h-fit rounded-lg border border-marca-beigeOscuro bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Resumen</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>Envio</span>
            <span>Gratis</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-marca-beigeOscuro pt-4 text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={irAPagar}
            className="mt-5 w-full rounded-md bg-marca-azul py-3 text-white hover:bg-marca-azulClaro"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  )
}
