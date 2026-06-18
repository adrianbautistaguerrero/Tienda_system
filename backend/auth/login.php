<?php
// Endpoint: inicio de sesion. Devuelve un token y los datos del usuario.
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(["error" => "Metodo no permitido"], 405);
}

$body = obtenerBody();
$email = trim($body["email"] ?? "");
$password = $body["password"] ?? "";

if ($email === "" || $password === "") {
    responder(["error" => "Email y contrasena son obligatorios"], 400);
}

$pdo = conectarDB();

$stmt = $pdo->prepare("SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$usuario = $stmt->fetch();

// Verifica que exista y que la contrasena coincida con el hash.
if (!$usuario || !password_verify($password, $usuario["password"])) {
    responder(["error" => "Credenciales incorrectas"], 401);
}

// Genera el token con los datos basicos del usuario.
$token = generarToken([
    "id" => (int) $usuario["id"],
    "email" => $usuario["email"],
    "rol" => $usuario["rol"],
    "exp" => time() + 60 * 60 * 24, // 24 horas
]);

responder([
    "token" => $token,
    "usuario" => [
        "id" => (int) $usuario["id"],
        "nombre" => $usuario["nombre"],
        "email" => $usuario["email"],
        "rol" => $usuario["rol"],
    ],
]);
