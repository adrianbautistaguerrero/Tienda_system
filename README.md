# Tienda Online — React + PHP (API REST)

Proyecto académico de tienda online con **frontend en React (Vite)** y **backend en PHP** (API REST sencilla con PDO/MySQL). Incluye autenticación con roles (administrador / cliente), catálogo, carrito, pago simulado y panel de administración.

---

## Tabla de contenido

1. [Arquitectura](#arquitectura)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Funcionalidades](#funcionalidades)
4. [Endpoints de la API](#endpoints-de-la-api)
5. [Cómo se construyó (paso a paso)](#cómo-se-construyó-paso-a-paso)
6. [Ejecutar en local](#ejecutar-en-local)
7. [Despliegue: Base de datos MySQL](#despliegue-1-base-de-datos-mysql)
8. [Despliegue: Backend PHP en Render](#despliegue-2-backend-php-en-render)
9. [Despliegue: Frontend React en Netlify](#despliegue-3-frontend-react-en-netlify)
10. [Credenciales de prueba](#credenciales-de-prueba)

---

## Arquitectura

```
┌────────────────┐        HTTP/JSON        ┌────────────────┐        PDO        ┌────────────────┐
│   React (SPA)  │  ───────────────────▶   │   PHP REST API │  ───────────────▶ │   MySQL        │
│   Netlify      │  ◀───────────────────   │   Render       │  ◀─────────────── │   (externo)    │
└────────────────┘     token JWT simple    └────────────────┘                   └────────────────┘
```

- **Frontend**: React + Vite + React Router + Axios + Tailwind. Se despliega como sitio estático en **Netlify**.
- **Backend**: PHP puro (sin framework), un archivo `.php` por endpoint, conexión por **PDO**. Se despliega en **Render** con Docker.
- **Base de datos**: MySQL. Render no ofrece MySQL gestionado, así que se usa un proveedor externo gratuito (Railway, Aiven, Clever Cloud, etc.).
- **Autenticación**: token tipo JWT firmado con HMAC-SHA256 (implementación mínima y didáctica), guardado en `localStorage`.

---

## Estructura del proyecto

```
.
├── index.html                 # Punto de entrada de Vite
├── package.json
├── vite.config.js
├── tailwind.config.js
├── netlify.toml               # Config de despliegue del frontend
├── .env.example               # VITE_API_URL
│
├── public/
│   └── productos/             # Imágenes de productos
│
├── src/
│   ├── main.jsx               # Bootstrap de React
│   ├── App.jsx                # Rutas
│   ├── index.css
│   ├── api/axios.js           # Cliente Axios + interceptor de token
│   ├── context/
│   │   ├── AuthContext.jsx    # Login, registro, sesión
│   │   └── CartContext.jsx    # Carrito (persistido en localStorage)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── RutaProtegida.jsx  # Protege rutas por rol
│   └── pages/
│       ├── Home.jsx
│       ├── Catalogo.jsx
│       ├── DetalleProducto.jsx
│       ├── Carrito.jsx
│       ├── Pago.jsx
│       ├── Login.jsx
│       ├── Registro.jsx
│       ├── cliente/DashboardCliente.jsx
│       └── admin/
│           ├── DashboardAdmin.jsx
│           ├── AdminProductos.jsx
│           ├── AdminCategorias.jsx
│           └── AdminPedidos.jsx
│
└── backend/                   # API REST en PHP
    ├── index.php              # Verificación de estado
    ├── router.php             # Router para el servidor embebido de PHP
    ├── Dockerfile             # Imagen para Render
    ├── render.yaml            # Blueprint opcional de Render
    ├── database.sql           # Esquema + datos de ejemplo
    ├── .env.example
    ├── config/
    │   ├── config.php         # Lee variables de entorno
    │   └── database.php       # Conexión PDO
    ├── helpers/funciones.php  # CORS, JSON, tokens, auth
    ├── auth/                  # login.php, registro.php
    ├── productos/             # listar, detalle, crear, actualizar, eliminar
    ├── categorias/            # listar, crear, actualizar, eliminar
    ├── pedidos/               # crear, mis_pedidos, listar, estado
    └── admin/                 # estadisticas.php
```

---

## Funcionalidades

**Cliente / público**
- Página de inicio con productos destacados y categorías.
- Catálogo con búsqueda y filtro por categoría.
- Detalle de producto.
- Carrito de compras (persistente).
- Pago simulado que genera un pedido.
- Registro e inicio de sesión.
- Panel de cliente con historial de pedidos.

**Administrador**
- Dashboard con estadísticas (ventas, pedidos, productos).
- CRUD de productos.
- CRUD de categorías.
- Gestión de pedidos y cambio de estado.

---

## Endpoints de la API

Todos devuelven JSON. Los marcados con 🔒 requieren header `Authorization: Bearer <token>`; con 👑 requieren rol administrador.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/registro.php` | Crear cuenta (rol cliente) |
| POST | `/auth/login.php` | Iniciar sesión, devuelve token |
| GET | `/productos/listar.php?buscar=&categoria_id=` | Listar / buscar productos |
| GET | `/productos/detalle.php?id=` | Detalle de un producto |
| POST | `/productos/crear.php` 🔒👑 | Crear producto |
| PUT | `/productos/actualizar.php` 🔒👑 | Actualizar producto |
| DELETE | `/productos/eliminar.php?id=` 🔒👑 | Eliminar producto |
| GET | `/categorias/listar.php` | Listar categorías |
| POST | `/categorias/crear.php` 🔒👑 | Crear categoría |
| PUT | `/categorias/actualizar.php` 🔒👑 | Actualizar categoría |
| DELETE | `/categorias/eliminar.php?id=` 🔒👑 | Eliminar categoría |
| POST | `/pedidos/crear.php` 🔒 | Crear pedido + pago |
| GET | `/pedidos/mis_pedidos.php` 🔒 | Pedidos del usuario |
| GET | `/pedidos/listar.php` 🔒👑 | Todos los pedidos |
| PUT | `/pedidos/estado.php` 🔒👑 | Cambiar estado de un pedido |
| GET | `/admin/estadisticas.php` 🔒👑 | Estadísticas del dashboard |

---

## Cómo se construyó (paso a paso)

### Backend (PHP)
1. **Configuración** (`config/config.php`): lee variables de entorno (`DB_*`, `JWT_SECRET`, `CORS_ORIGIN`) con valores por defecto para desarrollo.
2. **Conexión** (`config/database.php`): clase con PDO y manejo de errores.
3. **Helpers** (`helpers/funciones.php`):
   - `configurarCabeceras()` → CORS + responde preflight OPTIONS.
   - `responder()` / `obtenerBody()` → utilidades JSON.
   - `generarToken()` / `validarToken()` → token HMAC-SHA256.
   - `requerirAuth($rol)` → middleware de autenticación/autorización.
4. **Endpoints**: un archivo por acción. Cada uno incluye los helpers, configura cabeceras, valida método/auth y consulta con **sentencias preparadas** (previene inyección SQL).
5. **Seguridad**: contraseñas con `password_hash()` / `password_verify()`; el pedido se crea dentro de una **transacción** (pedido + detalle + pago).

### Frontend (React)
1. **Vite + Tailwind** para el tooling y estilos.
2. **Axios** (`api/axios.js`) con `baseURL` desde `VITE_API_URL` y un interceptor que adjunta el token.
3. **Contextos**: `AuthContext` (sesión) y `CartContext` (carrito en localStorage).
4. **React Router** con `RutaProtegida` para proteger rutas por rol.
5. **Páginas** divididas por área (público, cliente, admin).

---

## Ejecutar en local

### Requisitos
- Node.js 18+
- PHP 8.1+ con extensión `pdo_mysql`
- MySQL (local o XAMPP/Laragon)

### 1. Base de datos
```bash
mysql -u root -p < backend/database.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # ajusta DB_USER, DB_PASS, etc. (o usa variables de entorno)
php -S localhost:8000 router.php
```
La API queda en `http://localhost:8000`.

> En Windows con XAMPP también puedes copiar la carpeta `backend` a `htdocs` y usar Apache.

### 3. Frontend
```bash
# en la raíz del proyecto
cp .env.example .env        # VITE_API_URL=http://localhost:8000
npm install
npm run dev
```
La app queda en `http://localhost:5173`.

---

## Despliegue 1: Base de datos MySQL

Render no ofrece MySQL gestionado, así que crea la base en un proveedor externo gratuito. Ejemplo con **Railway**:

1. Crea cuenta en [railway.app](https://railway.app).
2. **New Project → Provision MySQL**.
3. Abre la pestaña **Variables** y copia: `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`.
4. Conéctate y carga el esquema (desde la pestaña *Data* / *Query*, o con cliente local):
   ```bash
   mysql -h <HOST> -P <PORT> -u <USER> -p <DATABASE> < backend/database.sql
   ```

Alternativas equivalentes: **Aiven**, **Clever Cloud**, **PlanetScale**, **InfinityFree**.

---

## Despliegue 2: Backend PHP en Render

1. Sube el repositorio a GitHub.
2. En [render.com](https://render.com): **New → Web Service** y conecta el repo.
3. Configura:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render detecta el `Dockerfile`).
4. En **Environment**, agrega las variables (usa los datos de tu base MySQL del paso anterior):

   | Variable | Valor |
   |----------|-------|
   | `DB_HOST` | host de MySQL |
   | `DB_PORT` | `3306` |
   | `DB_NAME` | nombre de la base |
   | `DB_USER` | usuario |
   | `DB_PASS` | contraseña |
   | `JWT_SECRET` | una cadena larga aleatoria |
   | `CORS_ORIGIN` | URL de tu sitio en Netlify (ej. `https://mi-tienda.netlify.app`) |

5. **Create Web Service**. Render construir�� la imagen y te dará una URL como `https://tienda-api.onrender.com`.
6. Verifica entrando a esa URL: deberías ver el JSON `{ "api": "Tienda UniShop", ... }`.

> El `Dockerfile` instala `pdo_mysql` y arranca el servidor embebido de PHP escuchando en `$PORT`.

---

## Despliegue 3: Frontend React en Netlify

1. En [netlify.com](https://netlify.com): **Add new site → Import an existing project** y conecta el repo.
2. Configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   (El archivo `netlify.toml` ya define esto y el redirect SPA.)
3. En **Site settings → Environment variables**, agrega:

   | Variable | Valor |
   |----------|-------|
   | `VITE_API_URL` | la URL de tu backend en Render (ej. `https://tienda-api.onrender.com`) |

4. **Deploy**. Cuando termine tendrás una URL como `https://mi-tienda.netlify.app`.
5. **Importante**: vuelve a Render y pon esa URL exacta en `CORS_ORIGIN`, luego redeploy del backend para que el navegador permita las peticiones.

---

## Credenciales de prueba

Incluidas en `backend/database.sql`:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin@tienda.com` | `admin123` |
| Cliente | `cliente@tienda.com` | `cliente123` |

> Cambia estas credenciales antes de un uso real.
