<?php
// Endpoint: cambia el estado de un pedido (solo administrador).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$body = obtenerBody();
$id = (int) ($body["id"] ?? 0);
$estado = $body["estado"] ?? "";

$estadosValidos = ["Pendiente", "Pagado", "Enviado", "Cancelado"];
if ($id === 0 || !in_array($estado, $estadosValidos, true)) {
    responder(["error" => "Datos invalidos"], 400);
}

$pdo = conectarDB();
$stmt = $pdo->prepare("UPDATE pedidos SET estado = ? WHERE id = ?");
$stmt->execute([$estado, $id]);

responder(["mensaje" => "Estado actualizado"]);
