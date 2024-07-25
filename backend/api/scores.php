<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class Scores {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function getScores($id) {
        $sql = "SELECT answer, answer_correct, answer_hint FROM scores WHERE user_id = ?";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute([$id]);
            $scores = $query->fetch(PDO::FETCH_ASSOC); // Utilisez fetch pour obtenir une seule ligne
            return $scores;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération des scores : ' . $e->getMessage()));
            exit;
        }
    }
}

// Utilisation de la classe pour récupérer les scores et renvoyer la réponse JSON
$scores = new Scores();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le paramètre 'id' est présent dans la requête GET
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $scoresData = $scores->getScores($id);
        // Assurez-vous que le résultat est en JSON et que le code de réponse HTTP est correct
        if ($scoresData) {
            echo json_encode($scoresData);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Scores non trouvés."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Paramètre 'id' manquant."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Méthode non autorisée."));
}
?>
