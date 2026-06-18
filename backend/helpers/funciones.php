<?php
// Muestra los errores en pantalla (quitar en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Funciones de ayuda compartidas por todos los endpoints.
require_once __DIR__ . "/../config/config.php";

// ... deja el resto de tu código exactamente igual ...
// Funciones de ayuda compartidas por todos los endpoints.

require_once __DIR__ . "/../config/config.php";

// Configura las cabeceras CORS y de tipo JSON.
// Responde automaticamente a las peticiones OPTIONS (preflight).
function configurarCabeceras()
{
    header("Access-Control-Allow-Origin: " . CORS_ORIGIN);
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=utf-8");

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit;
    }
}

// Devuelve una respuesta JSON con un codigo de estado.
function responder($data, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($data);
    exit;
}

// Lee y decodifica el cuerpo JSON de la peticion.
function obtenerBody()
{
    $json = file_get_contents("php://input");
    return json_decode($json, true) ?: [];
}

// --- Token simple tipo JWT (HS256) ---
// Implementacion minima y didactica, sin librerias externas.

function base64UrlEncode($data)
{
    return rtrim(strtr(base64_encode($data), "+/", "-_"), "=");
}

function base64UrlDecode($data)
{
    return base64_decode(strtr($data, "-_", "+/"));
}

// Genera un token con los datos del usuario.
function generarToken($payload)
{
    $header = base64UrlEncode(json_encode(["alg" => "HS256", "typ" => "JWT"]));
    $payload = base64UrlEncode(json_encode($payload));
    $firma = base64UrlEncode(hash_hmac("sha256", "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$firma";
}

// Valida un token y devuelve su payload, o null si es invalido.
function validarToken($token)
{
    $partes = explode(".", $token);
    if (count($partes) !== 3) {
        return null;
    }
    [$header, $payload, $firma] = $partes;
    $firmaEsperada = base64UrlEncode(hash_hmac("sha256", "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($firmaEsperada, $firma)) {
        return null;
    }
    return json_decode(base64UrlDecode($payload), true);
}

// Obtiene el usuario autenticado a partir del header Authorization.
// Si $rolRequerido se indica, valida que el usuario tenga ese rol.
function requerirAuth($rolRequerido = null)
{
    $headers = getallheaders();
    $auth = $headers["Authorization"] ?? ($headers["authorization"] ?? "");

    if (!preg_match("/Bearer\s+(.*)$/i", $auth, $matches)) {
        responder(["error" => "No autorizado"], 401);
    }

    $payload = validarToken($matches[1]);
    if (!$payload) {
        responder(["error" => "Token invalido"], 401);
    }

    if ($rolRequerido && ($payload["rol"] ?? "") !== $rolRequerido) {
        responder(["error" => "Acceso denegado"], 403);
    }

    return $payload;
}
