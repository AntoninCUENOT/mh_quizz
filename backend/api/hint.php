<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php'; // Inclure le fichier de configuration de la base de données

class HintAPI {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getHints() {
        $sql = "SELECT sound_path, theme_path FROM monster_correct";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

function sendJsonResponse($response, $code = 200) {
    http_response_code($code);
    echo json_encode($response);
}

try {
    $database = new Database();
    $pdo = $database->connect();
    $hintAPI = new HintAPI($pdo);

    $hints = $hintAPI->getHints();
    sendJsonResponse($hints);
} catch (PDOException $e) {
    sendJsonResponse(array('message' => 'Erreur lors de la récupération des données : ' . $e->getMessage()), 500);
}
?>
