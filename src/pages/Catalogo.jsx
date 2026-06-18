import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search } from "lucide-react"
import api from "../api/axios.js"
import ProductCard from "../components/ProductCard.jsx"

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaActiva = searchParams.get("categoria") || ""

  useEffect(() => {
    api.get("/categorias/listar.php").then(({ data }) => setCategorias(data))
  }, [])

  useEffect(() => {
    // Construye los parametros de busqueda y filtro para la API.
    const params = {}
    if (categoriaActiva) params.categoria = categoriaActiva
    if (busqueda) params.buscar = busqueda
    api.get("/productos/listar.php", { params }).then(({ data }) => setProductos(data))
  }, [categoriaActiva, busqueda])

  const filtrarCategoria = (id) => {
    if (id) setSearchParams({ categoria: id })
    else setSearchParams({})
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Catalogo de productos</h1>

      {/* Barra de busqueda */}
      <div className="mb-6 flex items-center gap-2 rounded-md border border-marca-beigeOscuro bg-white px-3 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filtro por categoria */}
        <aside className="w-full md:w-48">
          <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500">Categorias</h2>
          <ul className="flex flex-wrap gap-2 md:flex-col">
            <li>
              <button
                onClick={() => filtrarCategoria("")}
                className={`text-sm ${!categoriaActiva ? "font-semibold text-marca-azul" : "text-gray-600"}`}
              >
                Todas
              </button>
            </li>
            {categorias.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => filtrarCategoria(String(c.id))}
                  className={`text-sm ${categoriaActiva === String(c.id) ? "font-semibold text-marca-azul" : "text-gray-600"}`}
                >
                  {c.nombre}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Listado de productos */}
        <div className="flex-1">
          {productos.length === 0 ? (
            <p className="text-gray-500">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {productos.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
