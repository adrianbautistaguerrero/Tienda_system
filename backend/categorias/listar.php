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

// Endpoint: lista todas las categorias.
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

// Comento esta línea para que no haga conflicto con las cabeceras que acabamos de agregar arriba
// configurarCabeceras();

$pdo = conectarDB();
$stmt = $pdo->query("SELECT id, nombre FROM categorias ORDER BY nombre");
responder($stmt->fetchAll());