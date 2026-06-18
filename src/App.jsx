import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import RutaProtegida from "./components/RutaProtegida.jsx"

import Home from "./pages/Home.jsx"
import Catalogo from "./pages/Catalogo.jsx"
import DetalleProducto from "./pages/DetalleProducto.jsx"
import Carrito from "./pages/Carrito.jsx"
import Pago from "./pages/Pago.jsx"
import Login from "./pages/Login.jsx"
import Registro from "./pages/Registro.jsx"

import DashboardCliente from "./pages/cliente/DashboardCliente.jsx"
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx"
import AdminProductos from "./pages/admin/AdminProductos.jsx"
import AdminCategorias from "./pages/admin/AdminCategorias.jsx"
import AdminPedidos from "./pages/admin/AdminPedidos.jsx"

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5f0] font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas de cliente con protección */}
          <Route
            path="/pago"
            element={
              <RutaProtegida>
                <Pago />
              </RutaProtegida>
            }
          />
          <Route
            path="/cliente"
            element={
              <RutaProtegida>
                <DashboardCliente />
              </RutaProtegida>
            }
          />

          {/* Rutas de administrador (Acceso directo para pruebas) */}
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />

          <Route path="*" element={<div className="p-10 text-center">Página no encontrada</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}