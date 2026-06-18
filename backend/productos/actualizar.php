<?php
// Endpoint: actualiza un producto (solo administrador).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$body = obtenerBody();
$id = (int) ($body["id"] ?? 0);
$nombre = trim($body["nombre"] ?? "");
$descripcion = trim($body["descripcion"] ?? "");
$precio = (float) ($body["precio"] ?? 0);
$stock = (int) ($body["stock"] ?? 0);
$imagen = trim($body["imagen"] ?? "");
$categoria_id = (int) ($body["categoria_id"] ?? 0);

if ($id === 0 || $nombre === "") {
    responder(["error" => "Datos incompletos"], 400);
}

$pdo = conectarDB();
$stmt = $pdo->prepare(
    "UPDATE productos
     SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, categoria_id = ?
     WHERE id = ?"
);
$stmt->execute([$nombre, $descripcion, $precio, $stock, $imagen, $categoria_id, $id]);

responder(["mensaje" => "Producto actualizado"]);
