<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Répondre aux requêtes OPTIONS (pré-vol)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // Réponse vide pour les requêtes OPTIONS
}

require '../../Database.php';

class UserUpdater {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function updateRole($id, $role) {
        $sql = "UPDATE users SET role = :role WHERE id = :id";
        try {
            $query = $this->pdo->prepare($sql);
            $query->bindParam(':role', $role);
            $query->bindParam(':id', $id);
            $query->execute();

            if ($query->rowCount() > 0) {
                return true; // Mise à jour réussie
            } else {
                return false; // Utilisateur non trouvé
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la mise à jour du rôle : ' . $e->getMessage()));
            exit;
        }
    }
}

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userUpdater = new UserUpdater();

    // Récupérer les données envoyées par la requête
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $role = $data['role'];

    if (isset($id) && isset($role)) {
        if ($userUpdater->updateRole($id, $role)) {
            echo json_encode(array('message' => 'Rôle mis à jour avec succès.'));
        } else {
            http_response_code(404);
            echo json_encode(array('message' => 'Utilisateur non trouvé.'));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('message' => 'Données manquantes.'));
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Méthode non autorisée.'));
}
?>
