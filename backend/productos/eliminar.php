<?php
// Endpoint: elimina un producto (solo administrador).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$id = (int) ($_GET["id"] ?? 0);
if ($id === 0) {
    responder(["error" => "Id requerido"], 400);
}

$pdo = conectarDB();
$stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
$stmt->execute([$id]);

responder(["mensaje" => "Producto eliminado"]);
