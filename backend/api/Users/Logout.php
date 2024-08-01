<?php
// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
require_once('../../Database.php');
session_start();

class Logout {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function logout($user_id) {
        try {
            // Connexion à la base de données
            $pdo = $this->db->connect();
            
            // Préparation de la requête SQL pour supprimer la session
            $query = $pdo->prepare("DELETE FROM sessions WHERE user_id = :user_id");
            $query->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $query->execute();

            // Répondre avec succès
            return array('success' => true, 'message' => 'Session deleted successfully');
        } catch (PDOException $e) {
            // Erreur de base de données
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
}

// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre aux requêtes OPTIONS avec succès
    header('HTTP/1.1 200 OK');
    exit;
}
// Assurez-vous que la méthode HTTP est DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Récupérer l'ID utilisateur depuis la requête
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

    if ($user_id) {
        // Instanciation de la classe Database
        $db = new Database();
        
        // Instanciation de la classe LogoutHandler
        $logoutHandler = new Logout($db);

        try {
            // Appel de la méthode logout pour déconnecter l'utilisateur
            $result = $logoutHandler->logout($user_id);

            // Répondre avec succès
            http_response_code(200);
            echo json_encode($result);
        } catch (Exception $e) {
            // Erreur de déconnexion
            http_response_code(500);
            echo json_encode(array('error' => $e->getMessage()));
        }
    } else {
        // ID utilisateur non spécifié
        http_response_code(400);
        echo json_encode(array('error' => 'User ID not specified'));
    }
} else {
    // Méthode HTTP non autorisée
    http_response_code(405);
    echo json_encode(array('error' => 'Method Not Allowed'));
}
?>
