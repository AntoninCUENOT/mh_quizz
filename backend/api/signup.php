<?php
// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: POST, OPTIONS');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
// Inclure votre fichier de configuration de la base de données
require '../Database.php';

class UserRegistration {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function registerUser($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Préparer la requête pour insérer l'utilisateur
        $query = $this->pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
        $result = $query->execute([$username, $email, $hashedPassword]);
        
        if ($result) {
            // Récupérer l'identifiant de l'utilisateur inséré
            $userId = $this->pdo->lastInsertId();
            
            // Insérer une ligne dans la table scores pour le nouvel utilisateur
            $scoreQuery = $this->pdo->prepare("INSERT INTO scores (user_id) VALUES (?)");
            $scoreQuery->execute([$userId]);
            
            return $userId;
        }
        
        return false;
    }
}

// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre aux requêtes OPTIONS avec succès
    header('HTTP/1.1 200 OK');
    exit;
}

// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données JSON envoyées via POST
    $data = json_decode(file_get_contents('php://input'), true);

    // Valider les données
    if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400); // Bad request
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit();
    }

    try {
        // Connexion à la base de données
        $database = new Database();
        $pdo = $database->connect();

        // Instanciation de la classe UserRegistration
        $userRegistration = new UserRegistration($pdo);

        // Appel à la méthode pour enregistrer l'utilisateur
        $userId = $userRegistration->registerUser($data['username'], $data['email'], $data['password']);
        
        if ($userId) {
            echo json_encode(['success' => true, 'userId' => $userId]);
        } else {
            throw new Exception('Registration failed');
        }
    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
