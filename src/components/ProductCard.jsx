import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext.jsx"

export default function ProductCard({ producto }) {
  const { agregar } = useCart()

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-marca-beigeOscuro bg-white transition hover:shadow-md">
      <Link to={`/producto/${producto.id}`}>
        <img
          src={producto.imagen || "/placeholder.svg"}
          alt={producto.nombre}
          className="h-44 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/producto/${producto.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-marca-azul">{producto.nombre}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">{producto.descripcion}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-marca-azul">
            ${Number(producto.precio).toFixed(2)}
          </span>
          <button
            onClick={() => agregar(producto)}
            disabled={producto.stock < 1}
            className="rounded-md bg-marca-azul px-3 py-1.5 text-sm text-white hover:bg-marca-azulClaro disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {producto.stock < 1 ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  )
}
