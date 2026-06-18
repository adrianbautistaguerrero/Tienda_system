<?php
// Endpoint: registro de un nuevo usuario (rol cliente por defecto).
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(["error" => "Metodo no permitido"], 405);
}

$body = obtenerBody();
$nombre = trim($body["nombre"] ?? "");
$email = trim($body["email"] ?? "");
$password = $body["password"] ?? "";

if ($nombre === "" || $email === "" || $password === "") {
    responder(["error" => "Todos los campos son obligatorios"], 400);
}

$pdo = conectarDB();

// Verifica que el email no este registrado.
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    responder(["error" => "El email ya esta registrado"], 409);
}

// Guarda la contrasena de forma segura con hash.
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'cliente')"
);
$stmt->execute([$nombre, $email, $hash]);

responder(["mensaje" => "Usuario registrado correctamente"], 201);
