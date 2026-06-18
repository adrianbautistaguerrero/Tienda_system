import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Recupera el carrito guardado al cargar la app.
  useEffect(() => {
    const guardado = localStorage.getItem("carrito")
    if (guardado) {
      setItems(JSON.parse(guardado))
    }
  }, [])

  // Persiste el carrito cada vez que cambia.
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items))
  }, [items])

  const agregar = (producto) => {
    setItems((prev) => {
      const existe = prev.find((p) => p.id === producto.id)
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminar = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p)),
    )
  }

  const vaciar = () => setItems([])

  // Calcula el total sumando precio * cantidad de cada item.
  const total = items.reduce((acc, p) => acc + Number(p.precio) * p.cantidad, 0)
  const cantidadTotal = items.reduce((acc, p) => acc + p.cantidad, 0)

  return (
    <CartContext.Provider
      value={{ items, agregar, eliminar, cambiarCantidad, vaciar, total, cantidadTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
