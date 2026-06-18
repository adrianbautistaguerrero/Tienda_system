<?php

require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
$usuario = requerirAuth(); // cualquier usuario autenticado

$body = obtenerBody();
$items = $body["items"] ?? [];
$total = (float) ($body["total"] ?? 0);
$metodo = $body["metodo"] ?? "stripe";

if (empty($items)) {
    responder(["error" => "El carrito esta vacio"], 400);
}

$pdo = conectarDB();

try {
    // Usamos una transaccion para mantener la integridad de los datos.
    $pdo->beginTransaction();

    // 1) Crea el pedido con estado "Pagado" (simulacion).
    $stmt = $pdo->prepare(
        "INSERT INTO pedidos (usuario_id, total, estado, fecha)
         VALUES (?, ?, 'Pagado', NOW())"
    );
    $stmt->execute([$usuario["id"], $total]);
    $pedido_id = $pdo->lastInsertId();

    // 2) Inserta cada producto en el detalle del pedido.
    $stmtDetalle = $pdo->prepare(
        "INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio)
         VALUES (?, ?, ?, ?)"
    );
    // 3) Descuenta el stock de cada producto.
    $stmtStock = $pdo->prepare(
        "UPDATE productos SET stock = stock - ? WHERE id = ?"
    );

    foreach ($items as $item) {
        $producto_id = (int) $item["producto_id"];
        $cantidad = (int) $item["cantidad"];
        $precio = (float) $item["precio"];
        $stmtDetalle->execute([$pedido_id, $producto_id, $cantidad, $precio]);
        $stmtStock->execute([$cantidad, $producto_id]);
    }

    // 4) Registra el pago asociado al pedido.
    $stmtPago = $pdo->prepare(
        "INSERT INTO pagos (pedido_id, metodo, estado) VALUES (?, ?, 'Aprobado')"
    );
    $stmtPago->execute([$pedido_id, $metodo]);

    $pdo->commit();

    responder(["mensaje" => "Pedido creado", "pedido_id" => $pedido_id], 201);
} catch (Exception $e) {
    $pdo->rollBack();
    responder(["error" => "No se pudo procesar el pedido"], 500);
}
