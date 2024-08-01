<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require '../../Database.php';

class GetReseaux {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function execute() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $query = $this->pdo->query('SELECT id, nom, url, icon FROM reseaux');
                $reseaux = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($reseaux);
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

$action = new GetReseaux();
$action->execute();
?>
