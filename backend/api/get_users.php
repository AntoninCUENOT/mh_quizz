<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class User {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function getUsers() {
        $sql = "SELECT id, username, email, role FROM users";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute();
            $users = $query->fetchAll(PDO::FETCH_ASSOC);
            return $users;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération des utilisateurs : ' . $e->getMessage()));
            exit;
        }
    }
}

$user = new User();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $users = $user->getUsers();
    echo json_encode($users);
} else {
    http_response_code(405);
    echo json_encode(array('message' => 'Méthode non autorisée.'));
}
?>
