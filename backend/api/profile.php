<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class Profile {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function getProfile($id) {
        $sql = "SELECT id, username, email FROM users WHERE id = ?";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute([$id]);
            $infos = $query->fetch(PDO::FETCH_ASSOC); // Utilisez fetch au lieu de fetchAll si vous attendez une seule ligne
            return $infos;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération du profil : ' . $e->getMessage()));
            exit;
        }
    }
}

// Utilisation de la classe pour récupérer les informations et renvoyer la réponse JSON
$profile = new Profile();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le paramètre 'id' est présent dans la requête GET
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $infos = $profile->getProfile($id);
        // Assurez-vous que le résultat est en JSON et que le code de réponse HTTP est correct
        if ($infos) {
            echo json_encode($infos);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Profil non trouvé."));
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
