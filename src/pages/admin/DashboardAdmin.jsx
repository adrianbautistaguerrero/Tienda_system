import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Users, Package, ShoppingBag, Tag } from "lucide-react"
import api from "../../api/axios.js"

export default function DashboardAdmin() {
  const [stats, setStats] = useState({ usuarios: 0, productos: 0, pedidos: 0, categorias: 0 })

  useEffect(() => {
    api.get("/admin/estadisticas.php").then(({ data }) => setStats(data))
  }, [])

  const tarjetas = [
    { label: "Usuarios", valor: stats.usuarios, icon: Users },
    { label: "Productos", valor: stats.productos, icon: Package },
    { label: "Pedidos", valor: stats.pedidos, icon: ShoppingBag },
    { label: "Categorias", valor: stats.categorias, icon: Tag },
  ]

  const enlaces = [
    { to: "/admin/productos", label: "Gestionar productos" },
    { to: "/admin/categorias", label: "Gestionar categorias" },
    { to: "/admin/pedidos", label: "Gestionar pedidos" },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Panel de administracion</h1>

      {/* Tarjetas con conteos (sin graficos) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tarjetas.map((t) => (
          <div
            key={t.label}
            className="rounded-lg border border-marca-beigeOscuro bg-white p-5"
          >
            <t.icon size={22} className="text-marca-azul" />
            <p className="mt-3 text-3xl font-bold text-gray-800">{t.valor}</p>
            <p className="text-sm text-gray-500">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Accesos de gestion */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {enlaces.map((e) => (
          <Link
            key={e.to}
            to={e.to}
            className="rounded-lg border border-marca-beigeOscuro bg-white p-5 text-center font-medium text-gray-700 hover:border-marca-azul hover:text-marca-azul"
          >
            {e.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
