<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class ProfileUpdate {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function updateProfile($id, $username, $email) {
        $sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute([$username, $email, $id]);
            // Vérifier si la mise à jour a affecté des lignes
            if ($query->rowCount() > 0) {
                return array('message' => 'Profile updated successfully.');
            } else {
                return array('message' => 'No changes made to the profile.');
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return array('message' => 'Error updating profile: ' . $e->getMessage());
        }
    }
}

// Gestion des requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// Utilisation de la classe pour mettre à jour le profil et renvoyer la réponse JSON
$profileUpdate = new ProfileUpdate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lire les données POST
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Vérifier si les données nécessaires sont présentes
    if (isset($data['id']) && isset($data['username']) && isset($data['email'])) {
        $id = $data['id'];
        $username = $data['username'];
        $email = $data['email'];
        
        $response = $profileUpdate->updateProfile($id, $username, $email);
        echo json_encode($response);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Incomplete data provided."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
