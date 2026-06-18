<?php
// Configuracion general de la API.

// Datos fijos de conexion a la base de datos MariaDB.
define("DB_HOST", "127.0.0.1");
define("DB_NAME", "tienda");
define("DB_USER", "tienda_user"); // El usuario que creamos en MariaDB
define("DB_PASS", "123456");      // La contrasena que le pusimos
define("DB_PORT", "3306");

// Clave secreta para firmar los tokens de sesion.
define("JWT_SECRET", "clave_secreta_academica_cambiar");

// Origen permitido para CORS
define("CORS_ORIGIN", "*");