<?php
// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: POST, OPTIONS');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
session_start();
require '../Database.php';

class VerifyToken {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function verify($token) {
        try {
            // Connexion à la base de données
            $pdo = $this->db->connect();
            
            // Préparation de la requête SQL pour vérifier le token
            $sql = "SELECT user_id FROM sessions WHERE token = :token";
            $query = $pdo->prepare($sql);
            $query->bindParam(':token', $token, PDO::PARAM_STR);
            $query->execute();
            
            // Vérification si le token correspond à une session valide
            if ($query->rowCount() > 0) {
                // Token valide, envoyer une réponse de succès
                echo json_encode(array('success' => true));
            } else {
                // Token invalide, envoyer une réponse d'échec
                echo json_encode(array('success' => false));
            }
        } catch (PDOException $e) {
            // Erreur de connexion ou d'exécution de requête
            die("Erreur de vérification du token : " . $e->getMessage());
        }
    }
}
// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre aux requêtes OPTIONS avec succès
    header('HTTP/1.1 200 OK');
    exit;
}
// Vérification du token
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer le token depuis la requête POST
    $token = $_POST['token'];

    // Instanciation de la classe Database
    $db = new Database();
    
    // Instanciation de la classe VerifyToken
    $verifyToken = new VerifyToken($db);
    
    // Appel de la méthode verify pour vérifier le token
    $verifyToken->verify($token);
} else {
    // Méthode HTTP non autorisée
    http_response_code(405);
    echo json_encode(array('error' => 'Method Not Allowed'));
}
?>
