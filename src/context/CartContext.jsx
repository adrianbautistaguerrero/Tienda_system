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
        // Validación 1: Evitar que al sumar 1 se supere el stock disponible
        if (existe.cantidad >= producto.stock) {
          alert(`Límite alcanzado. Solo hay ${producto.stock} unidades en stock.`);
          return prev; // Retorna el carrito sin cambios
        }

        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
        )
      }

      // Validación 2: Evitar agregar un producto sin stock desde cero
      if (producto.stock < 1) {
        alert("Este producto está agotado.");
        return prev;
      }

      // Si todo está bien, se agrega por primera vez
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminar = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return

    setItems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // Validación 3: Evitar que suban la cantidad más allá del stock desde la vista del carrito
          if (cantidad > p.stock) {
            alert(`Solo hay ${p.stock} unidades disponibles.`);
            return { ...p, cantidad: p.stock }; // Lo topa al máximo disponible
          }
          return { ...p, cantidad };
        }
        return p;
      }),
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
