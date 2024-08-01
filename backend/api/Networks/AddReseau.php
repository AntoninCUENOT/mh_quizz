<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

require '../../Database.php';

class AddReseau {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function execute() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_FILES['icon']) || $_FILES['icon']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(['error' => 'File upload error']);
                return;
            }

            $data = $_POST;
            if (empty($data['nom']) || empty($data['url'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }

            $iconPath = $this->uploadFile($_FILES['icon']);
            if (!$iconPath) {
                http_response_code(500);
                echo json_encode(['error' => 'File upload failed']);
                return;
            }

            try {
                $query = $this->pdo->prepare('INSERT INTO reseaux (nom, url, icon) VALUES (?, ?, ?)');
                $query->execute([$data['nom'], $data['url'], $iconPath]);
                $id = $this->pdo->lastInsertId();
                echo json_encode(['success' => true, 'id' => $id]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
    }

    private function uploadFile($file) {
        $targetDir = '../../../src/assets/reseaux/logo/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $targetFile = $targetDir . basename($file['name']);
        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            return $targetFile;
        } else {
            return false;
        }
    }
}

$action = new AddReseau();
$action->execute();
?>
