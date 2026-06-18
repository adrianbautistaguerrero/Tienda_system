<?php
// Endpoint: crea una categoria (solo administrador).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$body = obtenerBody();
$nombre = trim($body["nombre"] ?? "");

if ($nombre === "") {
    responder(["error" => "El nombre es obligatorio"], 400);
}

$pdo = conectarDB();
$stmt = $pdo->prepare("INSERT INTO categorias (nombre) VALUES (?)");
$stmt->execute([$nombre]);

responder(["mensaje" => "Categoria creada", "id" => $pdo->lastInsertId()], 201);
