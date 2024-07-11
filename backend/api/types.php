<?php
// types.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class TypesAPI {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
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
            echo json_encode(['error' => 'Internal Server Error']);
            exit;
        }
    }
}

// Utilisation de la classe pour récupérer les types de monstres et renvoyer la réponse JSON
$typesAPI = new TypesAPI();
$types = $typesAPI->getTypes();

header('Content-Type: application/json');
echo json_encode($types);
?>
