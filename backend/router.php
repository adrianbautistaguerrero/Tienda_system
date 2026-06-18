# PHP CLI server router para Render.
# Sirve archivos estáticos existentes; el resto lo maneja index.php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // deja que el servidor sirva el archivo tal cual
}

require __DIR__ . '/index.php';
