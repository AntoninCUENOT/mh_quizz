<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config.php'; // Inclure votre fichier de connexion à la base de données

$images = array();
$stmt = $pdo->query("SELECT * FROM wallpaper");
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($images);
?>
