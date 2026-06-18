<?php
// Crea y devuelve una conexion PDO a la base de datos MySQL.

require_once __DIR__ . "/config.php";

function conectarDB()
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        // Esto imprimira el error REAL en tu consola/navegador
        echo json_encode(["error" => "Error de conexion: " . $e->getMessage()]);
        exit;
    }

    return $pdo;
}