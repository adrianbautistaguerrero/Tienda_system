<?php
// Endpoint: actualiza una categoria (solo administrador).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$body = obtenerBody();
$id = (int) ($body["id"] ?? 0);
$nombre = trim($body["nombre"] ?? "");

if ($id === 0 || $nombre === "") {
    responder(["error" => "Datos incompletos"], 400);
}

$pdo = conectarDB();
$stmt = $pdo->prepare("UPDATE categorias SET nombre = ? WHERE id = ?");
$stmt->execute([$nombre, $id]);

responder(["mensaje" => "Categoria actualizada"]);
