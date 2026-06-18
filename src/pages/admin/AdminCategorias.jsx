import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import api from "../../api/axios.js"

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState("")
  const [editandoId, setEditandoId] = useState(null)

  const cargar = () => {
    api.get("/categorias/listar.php").then(({ data }) => setCategorias(data))
  }

  useEffect(() => {
    cargar()
  }, [])

  const guardar = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    if (editandoId) {
      await api.put("/categorias/actualizar.php", { id: editandoId, nombre })
    } else {
      await api.post("/categorias/crear.php", { nombre })
    }
    setNombre("")
    setEditandoId(null)
    cargar()
  }

  const editar = (c) => {
    setNombre(c.nombre)
    setEditandoId(c.id)
  }

  const eliminar = async (id) => {
    if (!confirm("Eliminar esta categoria?")) return
    await api.delete(`/categorias/eliminar.php?id=${id}`)
    cargar()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Categorias</h1>

      {/* Formulario simple para crear/editar */}
      <form onSubmit={guardar} className="mb-6 flex gap-3">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoria"
          className="flex-1 rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none focus:border-marca-azul"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-md bg-marca-azul px-4 py-2 text-sm text-white hover:bg-marca-azulClaro"
        >
          <Plus size={16} />
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="divide-y divide-marca-beigeOscuro rounded-lg border border-marca-beigeOscuro bg-white">
        {categorias.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-gray-800">{c.nombre}</span>
            <div className="flex gap-3">
              <button onClick={() => editar(c)} className="text-gray-500 hover:text-marca-azul">
                <Pencil size={16} />
              </button>
              <button
                onClick={() => eliminar(c.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
