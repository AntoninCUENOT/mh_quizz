<?php
// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: POST, OPTIONS');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
session_start();
require '../../Database.php';

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
            // Récupérer user_id
            $row = $query->fetch(PDO::FETCH_ASSOC);
            $user_id = $row['user_id'];

            // Requête pour récupérer les données de l'utilisateur
            $sqlUser = "SELECT * FROM users WHERE id = :user_id";
            $queryUser = $pdo->prepare($sqlUser);
            $queryUser->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $queryUser->execute();

            // Vérifier si l'utilisateur existe
            if ($queryUser->rowCount() > 0) {
                // Récupérer les données de l'utilisateur
                $user = $queryUser->fetch(PDO::FETCH_ASSOC);

                // Envoyer une réponse de succès avec le rôle de l'utilisateur
                echo json_encode(['success' => true, 'role' => $user['role'], 'id' => $user['id']]);
            } else {
                // Utilisateur non trouvé dans la table users
                echo json_encode(['success' => false, 'error' => 'User not found']);
            }
        } else {
            // Token invalide, envoyer une réponse d'échec
            echo json_encode(['success' => false, 'error' => 'Invalid token']);
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
    $data = json_decode(file_get_contents('php://input'), true);
    $token = isset($data['token']) ? $data['token'] : null;

    if ($token !== null) {
        // Instanciation de la classe Database
        $db = new Database();
        
        // Instanciation de la classe VerifyToken
        $verifyToken = new VerifyToken($db);
        
        // Appel de la méthode verify pour vérifier le token
        $verifyToken->verify($token);
    } else {
        // Token non trouvé dans la requête POST
        http_response_code(400);
        echo json_encode(array('error' => 'Token not found in request'));
    }
} else {
    // Méthode HTTP non autorisée
    http_response_code(405);
    echo json_encode(array('error' => 'Method Not Allowed'));
}
?>