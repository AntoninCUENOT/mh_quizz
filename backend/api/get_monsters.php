<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class Monster {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function getMonsters($type_id = null) {
        $sql = "SELECT monsters.id, monsters.name, monsters.image_path, types.name as type_name 
                FROM monsters 
                INNER JOIN types ON monsters.type_id = types.id";
        $params = [];
        
        if ($type_id) {
            $sql .= " WHERE monsters.type_id = ?";
            $params[] = $type_id;
        }

        try {
            $query = $this->pdo->prepare($sql);
            $query->execute($params);
            $monsters = $query->fetchAll(PDO::FETCH_ASSOC);
            return $monsters;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération des monstres : ' . $e->getMessage()));
            exit;
        }
    }

    public function getMonsterById($id) {
        $sql = "SELECT monsters.*, GROUP_CONCAT(monster_map.map_id) AS maps
                FROM monsters 
                LEFT JOIN monster_map ON monsters.id = monster_map.monster_id
                WHERE monsters.id = ?
                GROUP BY monsters.id";
        
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute([$id]);
            $monster = $query->fetch(PDO::FETCH_ASSOC);
            if (!$monster) {
                http_response_code(404);
                echo json_encode(array('message' => 'Monstre non trouvé.'));
                exit;
            }
            return $monster;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération du monstre : ' . $e->getMessage()));
            exit;
        }
    }

    public function getTypes() {
        $sql = "SELECT id, name FROM types";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute();
            $types = $query->fetchAll(PDO::FETCH_ASSOC);
            return $types;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération des types : ' . $e->getMessage()));
            exit;
        }
    }
}

$monster = new Monster();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['type']) && $_GET['type'] === 'types') {
        $types = $monster->getTypes();
        header('Content-Type: application/json');
        echo json_encode($types);
    } elseif (isset($_GET['monsterId'])) {
        $id = $_GET['monsterId'];
        if (is_numeric($id)) {
            $monsterData = $monster->getMonsterById($id);
            header('Content-Type: application/json');
            echo json_encode($monsterData);
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'ID de monstre invalide.'));
        }
    } elseif (isset($_GET['type'])) {
        $type_id = $_GET['type'];
        if (is_numeric($type_id)) {
            $monsters = $monster->getMonsters($type_id);
            header('Content-Type: application/json');
            echo json_encode($monsters);
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'ID de type invalide.'));
        }
    } else {
        $monsters = $monster->getMonsters();
        header('Content-Type: application/json');
        echo json_encode($monsters);
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Méthode non autorisée."));
}
?>
