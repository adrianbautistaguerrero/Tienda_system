import { useEffect, useState } from "react"
import { User, Package } from "lucide-react"
import api from "../../api/axios.js"
import { useAuth } from "../../context/AuthContext.jsx"

// Colores de estado para los pedidos.
const estadoColor = {
  Pendiente: "bg-yellow-100 text-yellow-700",
  Pagado: "bg-marca-beige text-marca-azul",
  Enviado: "bg-blue-100 text-blue-700",
  Cancelado: "bg-red-100 text-red-700",
}

export default function DashboardCliente() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    api.get("/pedidos/mis_pedidos.php").then(({ data }) => setPedidos(data))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Mi cuenta</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Datos personales */}
        <div className="h-fit rounded-lg border border-marca-beigeOscuro bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-marca-azul">
            <User size={20} />
            <h2 className="font-semibold">Perfil</h2>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Nombre:</span> {usuario.nombre}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-medium text-gray-800">Email:</span> {usuario.email}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-medium text-gray-800">Rol:</span> {usuario.rol}
          </p>
        </div>

        {/* Historial de pedidos */}
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-marca-azul">
            <Package size={20} />
            <h2 className="font-semibold">Historial de pedidos</h2>
          </div>

          {pedidos.length === 0 ? (
            <p className="rounded-lg border border-marca-beigeOscuro bg-white p-5 text-sm text-gray-500">
              Aun no tienes pedidos.
            </p>
          ) : (
            <div className="space-y-3">
              {pedidos.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-marca-beigeOscuro bg-white p-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">Pedido #{p.id}</p>
                    <p className="text-sm text-gray-500">{p.fecha}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${Number(p.total).toFixed(2)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${estadoColor[p.estado] || "bg-gray-100 text-gray-600"}`}
                    >
                      {p.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
