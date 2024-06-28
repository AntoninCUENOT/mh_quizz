<?php
// index.php - Point d'entrée principal pour votre API

// Permettre l'accès aux ressources de manière sécurisée (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Lecture du chemin de la requête
$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

// Router les requêtes vers les fichiers appropriés dans api/
$path = $request_uri[0];
switch ($path) {
    case '/api/monsters':
        require 'api/monsters.php';
        break;
    default:
        // Gérer les routes non trouvées
        http_response_code(404);
        echo json_encode(array("message" => "Route non trouvée."));
        break;
}
?>
