<?php
// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: POST, OPTIONS');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
session_start();
require '../Database.php';

class UserAuthenticator {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function authenticateUser($username, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['id'] = $user['id'];
            $_SESSION['role'] = $user['role']; // Assurez-vous que le rôle est récupéré depuis la base de données
            return ['success' => true, 'role' => $user['role'], 'id' => $user['id']];
        } else {
            return ['success' => false, 'message' => 'Invalid credentials'];
        }
    }
}

// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre aux requêtes OPTIONS avec succès
    header('HTTP/1.1 200 OK');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données JSON envoyées via POST
    $data = json_decode(file_get_contents('php://input'), true);

    // Valider les données
    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400); // Bad request
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit();
    }

    try {
        // Connexion à la base de données
        $database = new Database();
        $pdo = $database->connect();

        // Instanciation de la classe UserAuthenticator
        $userAuthenticator = new UserAuthenticator($pdo);

        // Appel à la méthode pour authentifier l'utilisateur
        $result = $userAuthenticator->authenticateUser($data['username'], $data['password']);

        // Retourner une réponse JSON en fonction du résultat de l'authentification
        echo json_encode($result);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
