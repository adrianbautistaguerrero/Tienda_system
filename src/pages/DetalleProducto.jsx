import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import api from "../api/axios.js"
import { useCart } from "../context/CartContext.jsx"

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregar } = useCart()
  const [producto, setProducto] = useState(null)

  useEffect(() => {
    api.get(`/productos/detalle.php?id=${id}`).then(({ data }) => setProducto(data))
  }, [id])

  if (!producto) {
    return <div className="p-10 text-center text-gray-500">Cargando producto...</div>
  }

  
  const formatearRutaImagen = (ruta) => {
    if (!ruta) return "/placeholder.svg"
    if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta
    return ruta.startsWith("/") ? ruta : `/${ruta}`
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', border: 'none', background: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* Contenedor estricto con estilo en línea para controlar el tamaño */}
        <div style={{ 
          width: '100%', 
          
          minHeight: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
         
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}>
          <img
            src={formatearRutaImagen(producto.imagen)}
            alt={producto.nombre}
            onError={(e) => { e.target.src = "/placeholder.svg"; }}
            style={{ 
              
              width: '70%', 
              height: '90%', 
             
              objectFit: 'cover' 
            }}
          />
        </div>

        <div>
          <span style={{ color: '#2563eb', fontSize: '14px' }}>{producto.categoria_nombre}</span>
          <h1 style={{ marginTop: '5px', fontSize: '24px', fontWeight: 'bold' }}>{producto.nombre}</h1>
          <p style={{ marginTop: '15px', color: '#4b5563' }}>{producto.descripcion}</p>
          <p style={{ marginTop: '20px', fontSize: '30px', fontWeight: 'bold', color: '#2563eb' }}>
            ${Number(producto.precio).toFixed(2)}
          </p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#6b7280' }}>
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock"}
          </p>
          <button
            onClick={() => agregar(producto)}
            disabled={producto.stock < 1}
            style={{ 
              marginTop: '25px', 
              width: '100%', 
              padding: '12px', 
              backgroundColor: producto.stock < 1 ? '#ccc' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: producto.stock < 1 ? 'not-allowed' : 'pointer' 
            }}
          >
            {producto.stock < 1 ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  )
}