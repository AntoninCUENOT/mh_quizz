<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Inclure le fichier de configuration pour la connexion à la base de données
require_once '../config.php';

// Requête SQL pour récupérer toutes les maps
$sql = "SELECT id, name FROM maps";

try {
    // Préparer la requête SQL
    $query = $pdo->prepare($sql);

    // Exécuter la requête
    $query->execute();

    // Récupérer toutes les lignes résultantes sous forme de tableau associatif
    $maps = $query->fetchAll(PDO::FETCH_ASSOC);

    // Retourner les résultats au format JSON
    header('Content-Type: application/json');
    echo json_encode($maps);
} catch (PDOException $e) {
    // En cas d'erreur, retourner une réponse d'erreur
    http_response_code(500);
    echo json_encode(array('message' => 'Erreur lors de la récupération des maps : ' . $e->getMessage()));
}
?>
