<?php
// maps.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php';

class MapsAPI {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function getMaps() {
        $sql = "SELECT id, name FROM maps";
        try {
            $query = $this->pdo->prepare($sql);
            $query->execute();
            $maps = $query->fetchAll(PDO::FETCH_ASSOC);
            return $maps;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('message' => 'Erreur lors de la récupération des maps : ' . $e->getMessage()));
            exit;
        }
    }
}

// Utilisation de la classe pour récupérer les maps et renvoyer la réponse JSON
$mapsAPI = new MapsAPI();
$maps = $mapsAPI->getMaps();

header('Content-Type: application/json');
echo json_encode($maps);
?>
