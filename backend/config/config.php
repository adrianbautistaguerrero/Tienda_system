<?php
// Configuracion general de la API.

// Intentamos leer las variables de entorno (Render/Railway).
// Si no existen (porque estás en tu entorno local), usa tus datos por defecto.
define("DB_HOST", getenv("DB_HOST") ?: "127.0.0.1");
define("DB_NAME", getenv("DB_NAME") ?: "tienda");
define("DB_USER", getenv("DB_USER") ?: "tienda_user");
define("DB_PASS", getenv("DB_PASS") ?: "123456");
define("DB_PORT", getenv("DB_PORT") ?: "3306");

// Clave secreta para firmar los tokens de sesion.
define("JWT_SECRET", getenv("JWT_SECRET") ?: "clave_secreta_academica_cambiar");

// Origen permitido para CORS
define("CORS_ORIGIN", getenv("CORS_ORIGIN") ?: "*");
