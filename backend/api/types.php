<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Inclure le fichier de configuration pour la connexion à la base de données
require_once '../config.php';

// Requête SQL pour récupérer tous les types de monstres
$sql = "SELECT id, name FROM types";

try {
    // Préparer la requête
    $query = $pdo->prepare($sql);

    // Exécuter la requête
    $query->execute();

    // Récupérer tous les résultats sous forme de tableau associatif
    $types = $query->fetchAll(PDO::FETCH_ASSOC);

    // Renvoyer les données sous forme de JSON
    header('Content-Type: application/json');
    echo json_encode($types);
} catch (PDOException $e) {
    // En cas d'erreur PDO, renvoyer une erreur HTTP 500
    http_response_code(500);
    die(json_encode(['error' => 'Internal Server Error']));
}
?>
