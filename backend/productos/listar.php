<?php
// --- CABECERAS CORS AÑADIDAS AQUÍ ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Interceptar las peticiones OPTIONS de Axios
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ------------------------------------

// Endpoint: lista productos con busqueda por nombre y filtro por categoria.
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

// Comento esta línea para que no haga conflicto con las cabeceras que acabamos de agregar arriba
// configurarCabeceras();

$pdo = conectarDB();

$sql = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen,
               p.categoria_id, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE 1 = 1";
$params = [];

// Filtro opcional por categoria.
if (!empty($_GET["categoria"])) {
    $sql .= " AND p.categoria_id = ?";
    $params[] = (int) $_GET["categoria"];
}

// Busqueda opcional por nombre.
if (!empty($_GET["buscar"])) {
    $sql .= " AND p.nombre LIKE ?";
    $params[] = "%" . $_GET["buscar"] . "%";
}

$sql .= " ORDER BY p.id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
responder($stmt->fetchAll());