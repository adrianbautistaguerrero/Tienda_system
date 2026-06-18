<?php
require_once __DIR__ . "/../helpers/funciones.php";
require_once __DIR__ . "/../config/database.php";

configurarCabeceras();
requerirAuth("admin");

$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$precio = (float) ($_POST["precio"] ?? 0);
$stock = (int) ($_POST["stock"] ?? 0);
$categoria_id = (int) ($_POST["categoria_id"] ?? 0);

$rutaImagen = "";
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $nombreArchivo = time() . "_" . basename($_FILES['imagen']['name']);
    // Esta es la ruta donde se guarda el archivo físicamente
    $directorio = __DIR__ . "/../../public/uploads/";
    if (!is_dir($directorio)) mkdir($directorio, 0777, true);
    
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $directorio . $nombreArchivo)) {
        // Guardamos solo esto en la base de datos: uploads/archivo.jpg
        $rutaImagen = "uploads/" . $nombreArchivo;
    }
}

$pdo = conectarDB();
$stmt = $pdo->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->execute([$nombre, $descripcion, $precio, $stock, $rutaImagen, $categoria_id]);

responder(["mensaje" => "Producto creado", "id" => $pdo->lastInsertId()], 201);