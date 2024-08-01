<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Répondre aux requêtes OPTIONS (pré-vol)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require '../../Database.php';

class ScoreUpdater {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function updateScore($userId, $correct, $hintUsed) {
        $sql = "UPDATE scores SET answer = answer + 1, 
                answer_correct = answer_correct + :correct, 
                answer_hint = answer_hint + :hintUsed 
                WHERE user_id = :userId";
        try {
            $query = $this->pdo->prepare($sql);
            $query->bindParam(':userId', $userId, PDO::PARAM_INT);
            $query->bindParam(':correct', $correct, PDO::PARAM_INT);
            $query->bindParam(':hintUsed', $hintUsed, PDO::PARAM_INT);
            $query->execute();

            if ($query->rowCount() > 0) {
                return true; // Mise à jour réussie
            } else {
                return false; // Utilisateur non trouvé
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la mise à jour du score : ' . $e->getMessage()));
            exit;
        }
    }
}

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $scoreUpdater = new ScoreUpdater();

    // Récupérer les données envoyées par la requête
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'];
    $correct = isset($data['correct']) ? (int)$data['correct'] : 0;
    $hintUsed = isset($data['hintUsed']) ? (int)$data['hintUsed'] : 0;

    if (isset($userId) && isset($correct) && isset($hintUsed)) {
        if ($scoreUpdater->updateScore($userId, $correct, $hintUsed)) {
            echo json_encode(array('message' => 'Score mis à jour avec succès.'));
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
