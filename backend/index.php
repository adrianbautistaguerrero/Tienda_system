<?php
// Pagina raiz de la API. Sirve solo como verificacion de que el servidor responde.
require_once __DIR__ . "/helpers/funciones.php";

configurarCabeceras();

responder([
    "api" => "Tienda UniShop",
    "version" => "1.0",
    "estado" => "activa",
]);
