<?php
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(["error" => "Metodo no permitido"], 405);
}

$body = obtenerBody();
$email = trim($body["email"] ?? "");
$password = $body["password"] ?? "";

$pdo = conectarDB();
$stmt = $pdo->prepare("SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$usuario = $stmt->fetch();

if (!$usuario || !password_verify($password, $usuario["password"])) {
    responder(["error" => "Credenciales incorrectas"], 401);
}

$token = generarToken([
    "id" => (int) $usuario["id"],
    "email" => $usuario["email"],
    "rol" => $usuario["rol"],
]);

responder([
    "token" => $token,
    "usuario" => ["nombre" => $usuario["nombre"], "rol" => $usuario["rol"]]
]);
