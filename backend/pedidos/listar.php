<?php
// Endpoint: todos los pedidos con datos del cliente (solo administrador).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$pdo = conectarDB();
$stmt = $pdo->query(
    "SELECT pe.id, pe.total, pe.estado,
            DATE_FORMAT(pe.fecha, '%d/%m/%Y %H:%i') AS fecha,
            u.nombre AS cliente
     FROM pedidos pe
     JOIN usuarios u ON pe.usuario_id = u.id
     ORDER BY pe.fecha DESC"
);
responder($stmt->fetchAll());
