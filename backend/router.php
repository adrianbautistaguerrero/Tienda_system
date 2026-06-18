<?php
// --- INYECCIÓN GLOBAL DE CORS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
// --- FIN DE INYECCIÓN ---

# PHP CLI server router para Render.
# Sirve archivos estáticos existentes; el resto lo maneja index.php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // deja que el servidor sirva el archivo tal cual
}

require __DIR__ . '/index.php';
