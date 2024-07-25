<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Répondre aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // Réponse vide pour les requêtes OPTIONS
}

require '../Database.php';

class Monster {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function getMonsterById($id) {
        $sql = "SELECT image_path, sound_path, theme_path FROM monsters WHERE id = ?";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute([$id]);
            return $query->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération du monstre : ' . $e->getMessage()));
            exit;
        }
    }

    public function deleteMonster($id) {
        $sql = "DELETE FROM monsters WHERE id = ?";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute([$id]);
            return $query->rowCount() > 0;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la suppression du monstre : ' . $e->getMessage()));
            exit;
        }
    }

    public function deleteFiles($paths) {
        foreach ($paths as $path) {
            if ($path && file_exists($path)) {
                unlink($path);
            }
        }
    }
}

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $monster = new Monster();

    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // Récupérer les chemins des fichiers
        $monsterData = $monster->getMonsterById($id);

        // Supprimer les fichiers associés
        if ($monsterData) {
            $paths = [
                $monsterData['image_path'],
                $monsterData['sound_path'],
                $monsterData['theme_path']
            ];
            $monster->deleteFiles($paths);
        }

        // Supprimer le monstre
        if ($monster->deleteMonster($id)) {
            echo json_encode(array('message' => 'Monstre supprimé avec succès.'));
        } else {
            http_response_code(404);
            echo json_encode(array('message' => 'Monstre non trouvé.'));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('message' => 'Identifiant du monstre manquant.'));
    }
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Méthode non autorisée.'));
}
?>
