<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php'; // Inclure le fichier de configuration de la base de données

class MonsterCreator {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function createMonster($name, $type_id, $color, $size_min, $size_max, $description, $image, $sound, $theme, $maps) {
        try {
            // Début de la transaction pour assurer l'intégrité des données
            $this->pdo->beginTransaction();

            // Gestion des téléchargements d'image, de son et de thème
            $image_path = null;
            if (!empty($image)) {
                $image_path = $this->handleFileUpload($image, '../src/assets/monsters/images/', $name);
            }

            $sound_path = null;
            if (!empty($sound)) {
                $sound_path = $this->handleFileUpload($sound, '../src/assets/monsters/sounds/', $name);
            }

            $theme_path = null;
            if (!empty($theme)) {
                $theme_path = $this->handleFileUpload($theme, '../src/assets/monsters/themes/', $name);
            }

            // Insertion du monstre dans la table `monsters`
            $sql = "INSERT INTO monsters (name, type_id, color, size_min, size_max, description, image_path, sound_path, theme_path)
                    VALUES (:name, :type_id, :color, :size_min, :size_max, :description, :image_path, :sound_path, :theme_path)";
            $rqt = $this->pdo->prepare($sql);
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

            // Récupérer l'ID du monstre inséré
            $monsterId = $this->pdo->lastInsertId();

            // Insertion des associations dans la table `monster_map`
            if (!empty($maps)) {
                $sql = "INSERT INTO monster_map (monster_id, map_id) VALUES (:monster_id, :map_id)";
                $rqt = $this->pdo->prepare($sql);
    
                foreach ($maps as $mapId) {
                    $rqt->bindParam(':monster_id', $monsterId);
                    $rqt->bindParam(':map_id', $mapId);
                    $rqt->execute();
                }
            }

            // Valider la transaction
            $this->pdo->commit();

            // Retourner un message de succès
            return ['message' => 'Monster created successfully', 'monster_id' => $monsterId];

        } catch (PDOException $e) {
            // En cas d'erreur, annuler la transaction et renvoyer une erreur
            $this->pdo->rollBack();
            throw new Exception('Failed to create monster: ' . $e->getMessage());
        }
    }

    private function handleFileUpload($file, $uploadDir, $name) {
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
}

// Gestion des données envoyées via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $pdo = $database->connect();
        $monsterCreator = new MonsterCreator($pdo);

        // Récupération des données POST
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $type_id = isset($_POST['type_id']) ? intval($_POST['type_id']) : null;
        $color = isset($_POST['color']) ? trim($_POST['color']) : '';
        $size_min = isset($_POST['size_min']) ? intval($_POST['size_min']) : null;
        $size_max = isset($_POST['size_max']) ? intval($_POST['size_max']) : null;
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        $maps = isset($_POST['maps']) ? json_decode($_POST['maps'], true) : [];

        // Validation des données
        if (empty($name) || empty($type_id) || empty($maps)) {
            http_response_code(400); // Bad request
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }

        // Appel à la méthode pour créer le monstre
        $result = $monsterCreator->createMonster($name, $type_id, $color, $size_min, $size_max, $description, $_FILES['image'] ?? null, $_FILES['sound'] ?? null, $_FILES['theme'] ?? null, $maps);

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
