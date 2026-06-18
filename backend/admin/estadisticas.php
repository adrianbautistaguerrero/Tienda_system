<?php
// Endpoint: conteos para el dashboard del administrador (sin graficos).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$pdo = conectarDB();

$usuarios = $pdo->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();
$productos = $pdo->query("SELECT COUNT(*) FROM productos")->fetchColumn();
$pedidos = $pdo->query("SELECT COUNT(*) FROM pedidos")->fetchColumn();
$categorias = $pdo->query("SELECT COUNT(*) FROM categorias")->fetchColumn();

responder([
    "usuarios" => (int) $usuarios,
    "productos" => (int) $productos,
    "pedidos" => (int) $pedidos,
    "categorias" => (int) $categorias,
]);
