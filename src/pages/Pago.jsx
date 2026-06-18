import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import api from "../api/axios.js"
import { useCart } from "../context/CartContext.jsx"

// Metodos de pago simulados (solo visual, sin cobro real).
const metodos = [
  { id: "stripe", nombre: "Stripe", color: "#635bff" },
  { id: "paypal", nombre: "PayPal", color: "#003087" },
  { id: "mercadopago", nombre: "Mercado Pago", color: "#00b1ea" },
]

export default function Pago() {
  const { items, total, vaciar } = useCart()
  const navigate = useNavigate()
  const [metodo, setMetodo] = useState("stripe")
  const [procesando, setProcesando] = useState(false)
  const [exito, setExito] = useState(false)

  const pagar = async () => {
    setProcesando(true)
    try {
      // Registra el pedido y su detalle en la base de datos via API.
      const payload = {
        items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad, precio: i.precio })),
        total,
        metodo,
      }
      await api.post("/pedidos/crear.php", payload)
      // Simulacion: tras "pagar", se marca como exito.
      setTimeout(() => {
        setExito(true)
        vaciar()
      }, 1200)
    } catch (err) {
      alert("Ocurrio un error al procesar el pedido.")
      setProcesando(false)
    }
  }

  if (exito) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <CheckCircle size={56} className="mx-auto text-marca-azul" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Pago realizado</h1>
        <p className="mt-2 text-gray-600">
          Tu pedido fue registrado y marcado como pagado. Gracias por tu compra.
        </p>
        <button
          onClick={() => navigate("/cliente")}
          className="mt-6 rounded-md bg-marca-azul px-5 py-2.5 text-white hover:bg-marca-azulClaro"
        >
          Ver mis pedidos
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Pago</h1>

      <div className="rounded-lg border border-marca-beigeOscuro bg-white p-6">
        <p className="mb-1 text-sm text-gray-500">Total a pagar</p>
        <p className="mb-6 text-3xl font-bold text-marca-azul">${total.toFixed(2)}</p>

        <h2 className="mb-3 font-semibold text-gray-800">Selecciona un metodo de pago</h2>
        <div className="grid grid-cols-3 gap-3">
          {metodos.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetodo(m.id)}
              className={`rounded-md border p-3 text-sm font-medium transition ${
                metodo === m.id
                  ? "border-marca-azul bg-marca-beige"
                  : "border-marca-beigeOscuro bg-white"
              }`}
            >
              <span style={{ color: m.color }}>{m.nombre}</span>
            </button>
          ))}
        </div>

        {/* Formulario simulado, sin validacion real ni cobro */}
        <div className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Numero de tarjeta (simulado)"
            className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="MM/AA"
              className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Esta es una simulacion academica. No se realiza ningun cobro real.
        </p>

        <button
          onClick={pagar}
          disabled={procesando}
          className="mt-5 w-full rounded-md bg-marca-azul py-3 text-white hover:bg-marca-azulClaro disabled:bg-gray-300"
        >
          {procesando ? "Procesando..." : "Pagar ahora"}
        </button>
      </div>
    </div>
  )
}
