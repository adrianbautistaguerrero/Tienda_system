<?php
// Endpoint: detalle de un producto por id.
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();

$id = (int) ($_GET["id"] ?? 0);
if ($id === 0) {
    responder(["error" => "Id requerido"], 400);
}

$pdo = conectarDB();
$stmt = $pdo->prepare(
    "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen,
            p.categoria_id, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     WHERE p.id = ?"
);
$stmt->execute([$id]);
$producto = $stmt->fetch();

if (!$producto) {
    responder(["error" => "Producto no encontrado"], 404);
}

responder($producto);
