import { useEffect, useState } from "react"
import api from "../../api/axios.js"

const estados = ["Pendiente", "Pagado", "Enviado", "Cancelado"]

const estadoColor = {
  Pendiente: "bg-yellow-100 text-yellow-700",
  Pagado: "bg-marca-beige text-marca-azul",
  Enviado: "bg-blue-100 text-blue-700",
  Cancelado: "bg-red-100 text-red-700",
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])

  const cargar = () => {
    api.get("/pedidos/listar.php").then(({ data }) => setPedidos(data))
  }

  useEffect(() => {
    cargar()
  }, [])

  const cambiarEstado = async (id, estado) => {
    await api.put("/pedidos/estado.php", { id, estado })
    cargar()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Gestion de pedidos</h1>

      <div className="overflow-x-auto rounded-lg border border-marca-beigeOscuro bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-marca-beigeOscuro bg-marca-beige text-gray-600">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Cambiar estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marca-beigeOscuro">
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-gray-800">#{p.id}</td>
                <td className="px-4 py-3 text-gray-600">{p.cliente}</td>
                <td className="px-4 py-3 text-gray-600">{p.fecha}</td>
                <td className="px-4 py-3 text-gray-600">${Number(p.total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${estadoColor[p.estado] || "bg-gray-100 text-gray-600"}`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p.id, e.target.value)}
                    className="rounded-md border border-marca-beigeOscuro px-2 py-1 text-sm outline-none"
                  >
                    {estados.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
