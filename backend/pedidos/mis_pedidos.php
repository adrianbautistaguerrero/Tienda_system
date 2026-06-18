<?php
// Endpoint: pedidos del usuario autenticado (historial del cliente).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
$usuario = requerirAuth();

$pdo = conectarDB();
$stmt = $pdo->prepare(
    "SELECT id, total, estado, DATE_FORMAT(fecha, '%d/%m/%Y %H:%i') AS fecha
     FROM pedidos
     WHERE usuario_id = ?
     ORDER BY fecha DESC"
);
$stmt->execute([$usuario["id"]]);
responder($stmt->fetchAll());
