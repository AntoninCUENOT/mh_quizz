<?php
// api/suggestions.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php'; // Inclure le fichier de configuration de la base de données

class SuggestionsAPI {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getSuggestions($query) {
        $query = htmlspecialchars(strip_tags($query)); // Sécuriser l'entrée utilisateur
        $sql = "SELECT name FROM monsters WHERE name LIKE ? LIMIT 10";
        $stmt = $this->pdo->prepare($sql);
        $param = "%{$query}%";
        $stmt->execute([$param]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}

// Initialiser la connexion à la base de données
$database = new Database();
$pdo = $database->connect();

// Créer une instance de l'API des suggestions
$suggestionsAPI = new SuggestionsAPI($pdo);

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le paramètre 'q' est présent dans la requête GET
    if (isset($_GET['q'])) {
        $suggestions = $suggestionsAPI->getSuggestions($_GET['q']);
        sendJsonResponse($suggestions);
    } else {
        sendJsonResponse(array("message" => "Paramètre 'q' manquant."), 400);
    }
} else {
    sendJsonResponse(array("message" => "Méthode non autorisée."), 405);
}

// Fonction pour envoyer une réponse JSON
function sendJsonResponse($response, $code = 200) {
    http_response_code($code);
    echo json_encode($response);
}
?>
