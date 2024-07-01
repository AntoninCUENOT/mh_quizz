<?php
// api/suggestions.php

// Permettre l'accès à partir de tous les domaines (à utiliser uniquement pour le développement local)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../config.php'; // Inclure le fichier de configuration de la base de données

// Fonction pour envoyer une réponse JSON
function sendJsonResponse($response, $code = 200) {
    http_response_code($code);
    echo json_encode($response);
}

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le paramètre 'q' est présent dans la requête GET
    if (isset($_GET['q'])) {
        $query = $_GET['q'];

        try {
            // Sélectionner les noms des monstres correspondant à l'input utilisateur
            $sql = "SELECT name FROM monsters WHERE name LIKE ? LIMIT 10";
            $stmt = $pdo->prepare($sql);
            $param = "%{$query}%";
            $stmt->execute([$param]);
            $suggestions = $stmt->fetchAll(PDO::FETCH_COLUMN);

            sendJsonResponse($suggestions);
        } catch (PDOException $e) {
            sendJsonResponse(array("message" => "Erreur de base de données: " . $e->getMessage()), 500);
        }
    } else {
        sendJsonResponse(array("message" => "Paramètre 'q' manquant."), 400);
    }
} else {
    sendJsonResponse(array("message" => "Méthode non autorisée."), 405);
}
?>
