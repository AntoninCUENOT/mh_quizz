<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Répondre aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // Réponse vide pour les requêtes OPTIONS
}

require '../Database.php';

class MonsterUpdater {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function updateMonster($id, $name, $type_id, $color, $size_min, $size_max, $description, $image, $sound, $theme, $maps) {
        try {
            // Début de la transaction pour assurer l'intégrité des données
            $this->pdo->beginTransaction();

            // Gestion des téléchargements de fichiers
            $currentPaths = $this->getCurrentPaths($id);
            $image_path = $this->handleFileUpdate($image, '../../src/assets/monsters/images/', $name, $currentPaths['image_path']);
            $sound_path = $this->handleFileUpdate($sound, '../../src/assets/monsters/sounds/', $name, $currentPaths['sound_path']);
            $theme_path = $this->handleFileUpdate($theme, '../../src/assets/monsters/themes/', $name, $currentPaths['theme_path']);

            // Mise à jour des données du monstre
            $sql = "UPDATE monsters SET 
                    name = :name, 
                    type_id = :type_id, 
                    color = :color, 
                    size_min = :size_min, 
                    size_max = :size_max, 
                    description = :description, 
                    image_path = :image_path, 
                    sound_path = :sound_path, 
                    theme_path = :theme_path
                    WHERE id = :id";
            $rqt = $this->pdo->prepare($sql);
            $rqt->bindParam(':id', $id);
            $rqt->bindParam(':name', $name);
            $rqt->bindParam(':type_id', $type_id);
            $rqt->bindParam(':color', $color);
            $rqt->bindParam(':size_min', $size_min);
            $rqt->bindParam(':size_max', $size_max);
            $rqt->bindParam(':description', $description);
            $rqt->bindParam(':image_path', $image_path);
            $rqt->bindParam(':sound_path', $sound_path);
            $rqt->bindParam(':theme_path', $theme_path);
            $rqt->execute();

            // Mise à jour des associations dans la table `monster_map`
            $this->updateMonsterMaps($id, $maps);

            // Valider la transaction
            $this->pdo->commit();

            // Répondre avec succès
            return ['message' => 'Monster updated successfully'];

        } catch (PDOException $e) {
            // En cas d'erreur, annuler la transaction et retourner une erreur
            $this->pdo->rollBack();
            throw new Exception('Failed to update monster: ' . $e->getMessage());
        }
    }

    private function getCurrentPaths($monsterId) {
        $sql = "SELECT image_path, sound_path, theme_path FROM monsters WHERE id = ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$monsterId]);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    private function handleFileUpdate($file, $uploadDir, $name, $currentPath) {
        // Si un nouveau fichier est fourni
        if (!empty($file) && isset($file['tmp_name']) && $file['tmp_name'] != '') {
            // Supprimer l'ancien fichier si celui-ci existe
            if ($currentPath && file_exists($currentPath)) {
                unlink($currentPath);
            }
    
            // Gérer le téléchargement du nouveau fichier
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
    
            $fileName = $name . '_' . basename($file['name']);
            $targetPath = $uploadDir . $fileName;
    
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                return $targetPath;
            } else {
                throw new Exception('Failed to upload file ' . $file['name']);
            }
        }
        // Si aucun fichier n'est fourni, retourner l'ancien chemin
        return $currentPath;
    }
    

    private function updateMonsterMaps($monsterId, $maps) {
        // Supprimer les associations existantes
        $sql = "DELETE FROM monster_map WHERE monster_id = ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$monsterId]);

        // Ajouter les nouvelles associations
        if (!empty($maps)) {
            $sql = "INSERT INTO monster_map (monster_id, map_id) VALUES (?, ?)";
            $query = $this->pdo->prepare($sql);
            foreach ($maps as $mapId) {
                $query->execute([$monsterId, $mapId]);
            }
        }
    }
}

// Gestion des données envoyées via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $pdo = $database->connect();
        $monsterUpdater = new MonsterUpdater($pdo);

        // Récupération des données POST
        $id = $_GET['id'] ?? null;
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $type_id = isset($_POST['type_id']) ? intval($_POST['type_id']) : null;
        $color = isset($_POST['color']) ? trim($_POST['color']) : '';
        $size_min = isset($_POST['size_min']) ? intval($_POST['size_min']) : null;
        $size_max = isset($_POST['size_max']) ? intval($_POST['size_max']) : null;
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        $maps = isset($_POST['maps']) ? json_decode($_POST['maps'], true) : [];

        // Validation des données
        if (empty($id) || empty($name) || empty($type_id)) {
            http_response_code(400); // Bad request
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }

        // Appel à la méthode pour mettre à jour le monstre
        $result = $monsterUpdater->updateMonster($id, $name, $type_id, $color, $size_min, $size_max, $description, $_FILES['image'] ?? null, $_FILES['sound'] ?? null, $_FILES['theme'] ?? null, $maps);

        // Répondre avec succès
        http_response_code(200);
        echo json_encode($result);

    } catch (Exception $e) {
        // En cas d'erreur, retourner une réponse d'erreur
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    // Méthode non autorisée
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
