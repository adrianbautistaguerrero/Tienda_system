import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import api from "../../api/axios.js"

const vacio = { nombre: "", descripcion: "", precio: "", stock: "", categoria_id: "", imagen: "" }

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(vacio)
  const [archivo, setArchivo] = useState(null) // Estado para el archivo
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const cargar = () => {
    api.get("/productos/listar.php").then(({ data }) => setProductos(data))
  }

  useEffect(() => {
    cargar()
    api.get("/categorias/listar.php").then(({ data }) => setCategorias(data))
  }, [])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const abrirNuevo = () => {
    setForm(vacio)
    setEditandoId(null)
    setMostrarForm(true)
  }

  const abrirEditar = (p) => {
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoria_id: p.categoria_id })
    setEditandoId(p.id)
    setMostrarForm(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(form).forEach(key => formData.append(key, form[key]))
    if (archivo) formData.append("imagen", archivo)
    if (editandoId) formData.append("id", editandoId)

    await api.post(editandoId ? "/productos/actualizar.php" : "/productos/crear.php", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    setMostrarForm(false)
    setArchivo(null)
    cargar()
  }

  const eliminar = async (id) => {
    if (!confirm("Eliminar este producto?")) return
    await api.delete(`/productos/eliminar.php?id=${id}`)
    cargar()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <button onClick={abrirNuevo} className="flex items-center gap-1 rounded-md bg-marca-azul px-4 py-2 text-sm text-white hover:bg-marca-azulClaro">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={guardar} className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-marca-beigeOscuro bg-white p-5 sm:grid-cols-2">
          <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Nombre" required className="rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none" />
          <select name="categoria_id" value={form.categoria_id} onChange={cambiar} required className="rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none">
            <option value="">Selecciona categoria</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <input name="precio" type="number" step="0.01" value={form.precio} onChange={cambiar} placeholder="Precio" required className="rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none" />
          <input name="stock" type="number" value={form.stock} onChange={cambiar} placeholder="Stock" required className="rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none" />
          
          {/* EL CAMBIO: Input de archivo manteniendo el estilo */}
          <input type="file" onChange={(e) => setArchivo(e.target.files[0])} accept="image/*" className="rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none sm:col-span-2" />
          
          <textarea name="descripcion" value={form.descripcion} onChange={cambiar} placeholder="Descripcion" rows={2} className="rounded-md border border-marca-beigeOscuro px-3 py-2 text-sm outline-none sm:col-span-2" />
          
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="rounded-md bg-marca-azul px-4 py-2 text-sm text-white">Guardar</button>
            <button type="button" onClick={() => setMostrarForm(false)} className="rounded-md bg-marca-beige px-4 py-2 text-sm text-gray-700">Cancelar</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-marca-beigeOscuro bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-marca-beigeOscuro bg-marca-beige text-gray-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marca-beigeOscuro">
            {productos.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.nombre}</td>
                <td className="px-4 py-3">${Number(p.precio).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.categoria_nombre}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => abrirEditar(p)} className="text-gray-500 hover:text-marca-azul"><Pencil size={16} /></button>
                    <button onClick={() => eliminar(p.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}