-- ============================================================
-- Base de datos: Tienda en linea academica "UniShop"
-- Motor: MySQL 5.7+ / 8.0
-- ============================================================
-- Para importar:
--   1) Crear la base de datos (o usar la que provee Render).
--   2) Ejecutar este script completo.
-- ============================================================

-- Si trabajas en local, puedes crear la base asi:
-- CREATE DATABASE IF NOT EXISTS tienda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE tienda;

-- ------------------------------------------------------------
-- Tabla: usuarios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente'
);

-- ------------------------------------------------------------
-- Tabla: categorias
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- Tabla: productos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Tabla: pedidos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    estado ENUM('Pendiente', 'Pagado', 'Enviado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabla: detalle_pedido
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT,
    cantidad INT NOT NULL DEFAULT 1,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Tabla: pagos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'Aprobado',
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

-- Usuarios de prueba.
-- IMPORTANTE: las contrasenas estan cifradas con bcrypt.
--   Administrador -> email: admin@unishop.com   contrasena: admin123
--   Cliente       -> email: cliente@unishop.com contrasena: cliente123
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@unishop.com', '$2y$10$9YEJabKjmOT1qSJwrTSui.fV6mBa6hgfdr2BELEI0VK93dRhjx7sO', 'admin'),
('Cliente Demo', 'cliente@unishop.com', '$2y$10$aSj3IA0JzEEUnmavKaI.UO7hR1k2sPDOpZDdqgNLZz6iaguXaDJHi', 'cliente');

-- Categorias.
INSERT INTO categorias (nombre) VALUES
('Tecnologia'),
('Hogar'),
('Accesorios'),
('Libros');

-- Productos.
INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id) VALUES
('Audifonos Inalambricos', 'Audifonos bluetooth con cancelacion de ruido y bateria de larga duracion.', 49.99, 25, '/productos/audifonos.png', 1),
('Teclado Mecanico', 'Teclado mecanico retroiluminado, ideal para trabajo y estudio.', 65.00, 15, '/productos/teclado.png', 1),
('Mouse Ergonomico', 'Mouse inalambrico con diseno ergonomico y bateria recargable.', 29.50, 30, '/productos/mouse.png', 3),
('Lampara de Escritorio', 'Lampara LED con brazo ajustable y tres niveles de intensidad.', 22.00, 20, '/productos/lampara.png', 2),
('Botella Termica', 'Botella de acero inoxidable que mantiene la temperatura por 12 horas.', 18.75, 40, '/productos/botella.png', 2),
('Mochila Urbana', 'Mochila resistente al agua con compartimento para laptop.', 39.90, 18, '/productos/mochila.png', 3),
('Libro: Introduccion a la Programacion', 'Guia practica para iniciar en el mundo del desarrollo de software.', 25.00, 50, '/productos/libro.png', 4),
('Hub USB-C', 'Adaptador multipuerto USB-C con HDMI y lector de tarjetas.', 33.20, 22, '/productos/hub.png', 1);
