<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require '../../Database.php';

class DeleteReseau {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function handleRequest() {
        // Vérifier la méthode de requête HTTP
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            // Répondre aux requêtes OPTIONS avec succès
            header('HTTP/1.1 200 OK');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }

            try {
                // Récupérer le chemin du fichier avant de supprimer l'entrée
                $query = $this->pdo->prepare('SELECT icon FROM reseaux WHERE id = ?');
                $query->execute([$data['id']]);
                $reseau = $query->fetch(PDO::FETCH_ASSOC);

                if (!$reseau) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Network not found']);
                    return;
                }

                // Supprimer le fichier s'il existe
                $iconPath = $reseau['icon'];
                if (file_exists($iconPath)) {
                    unlink($iconPath);
                }

                // Supprimer l'entrée de la base de données
                $query = $this->pdo->prepare('DELETE FROM reseaux WHERE id = ?');
                $success = $query->execute([$data['id']]);

                if ($success) {
                    echo json_encode(['success' => true]);
                } else {
                    throw new Exception('Deletion failed');
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
    }
}

$action = new DeleteReseau();
$action->handleRequest();
?>
