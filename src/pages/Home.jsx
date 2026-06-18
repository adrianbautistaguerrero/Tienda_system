import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios.js"
import ProductCard from "../components/ProductCard.jsx"

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    // Carga productos y categorias para mostrar en la portada.
    api.get("/productos/listar.php").then(({ data }) => setDestacados(data.slice(0, 4)))
    api.get("/categorias/listar.php").then(({ data }) => setCategorias(data))
  }, [])

  // Función para extraer el nombre exacto de la imagen y apuntar a la carpeta
  const formatearRutaImagen = (ruta) => {
    if (!ruta) return "/placeholder.svg"
    if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta
    
    const nombreArchivo = ruta.split('/').pop()
    return `/productos/${nombreArchivo}`
  }

  return (
    <div>
      {/* Seccion principal / hero */}
      <section className="bg-marca-beige">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 md:flex-row md:py-20">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Bienvenido 
            </h1>
            <p className="mt-3 max-w-md text-gray-600">
             Todo lo que un ING.Sistemas necesesita
            </p>
            <Link
              to="/catalogo"
              className="mt-6 inline-block rounded-md bg-marca-azul px-5 py-2.5 text-white hover:bg-marca-azulClaro"
            >
              Ver catalogo
            </Link>
          </div>
          <div className="flex-1">
            
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-5 text-xl font-bold text-gray-800">Categorias</h2>
        <div className="flex flex-wrap gap-3">
          {categorias.map((c) => (
            <Link
              key={c.id}
              to={`/catalogo?categoria=${c.id}`}
              className="rounded-full border border-marca-beigeOscuro bg-white px-4 py-2 text-sm text-gray-700 hover:border-marca-azul hover:text-marca-azul"
            >
              {c.nombre}
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-5 text-xl font-bold text-gray-800">Productos destacados</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((p) => {
            // Clonamos el objeto producto y le inyectamos la ruta de imagen corregida
            const productoCorregido = { ...p, imagen: formatearRutaImagen(p.imagen) };
            
            return <ProductCard key={productoCorregido.id} producto={productoCorregido} />;
          })}
        </div>
      </section>
    </div>
  )
}
