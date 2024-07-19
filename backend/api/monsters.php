<?php
// api/monsters.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php'; // Inclure le fichier de configuration de la base de données

class MonsterAPI {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getMonsterDetails($name) {
        $name = htmlspecialchars(strip_tags($name)); // Sécuriser l'entrée utilisateur

        $correctMonster = $this->getCorrectMonster();
        $userMonster = $this->getUserMonster($name);

        if ($userMonster) {
            return $this->prepareResponse($userMonster, $correctMonster, $name);
        } else {
            return array("correct_guess" => false, "message" => "Monstre non trouvé.");
        }
    }

    private function getCorrectMonster() {
        $query = "SELECT mc.name AS correct_name, t1.name AS correct_type, mc.color AS correct_color, mc.description AS correct_description, mc.size_min AS correct_size_min, mc.size_max AS correct_size_max, mc.image_path AS correct_image_path, GROUP_CONCAT(maps.name SEPARATOR ', ') AS correct_maps
                  FROM monster_correct mc 
                  JOIN monster_map mm ON mc.id = mm.monster_id 
                  JOIN maps ON maps.id = mm.map_id
                  JOIN types t1 ON t1.id = mc.type_id
                  GROUP BY mc.id";
        $rqt = $this->pdo->prepare($query);
        $rqt->execute();
        return $rqt->fetch(PDO::FETCH_ASSOC);
    }

    private function getUserMonster($name) {
        $query = "SELECT m.name AS user_name, t2.name AS user_type, m.color AS user_color, m.description AS user_description, m.size_min AS user_size_min, m.size_max AS user_size_max, m.image_path AS user_image_path, GROUP_CONCAT(maps.name SEPARATOR ', ') AS user_maps
                  FROM monsters m 
                  JOIN monster_map mm ON m.id = mm.monster_id 
                  JOIN maps ON maps.id = mm.map_id 
                  JOIN types t2 ON t2.id = m.type_id
                  WHERE m.name = ?
                  GROUP BY m.id";
        $rqt = $this->pdo->prepare($query);
        $rqt->execute([$name]);
        return $rqt->fetch(PDO::FETCH_ASSOC);
    }

    private function prepareResponse($userMonster, $correctMonster, $userInput) {
        $utilisateurInput = htmlspecialchars($userInput);
        $response = array();
        $response['correct_guess'] = ($utilisateurInput === $correctMonster['correct_name']);

        // Formater les détails du monstre utilisateur pour l'affichage HTML avec les classes CSS appropriées
        $formatted_details = array();
        $correct_maps = explode(', ', $correctMonster['correct_maps']);
        $user_maps = explode(', ', $userMonster['user_maps']);

        foreach (['name', 'type', 'color', 'description', 'image_path'] as $key) {
            $user_key = "user_" . $key;
            $correct_key = "correct_" . $key;
            if ($userMonster[$user_key] === $correctMonster[$correct_key]) {
                $formatted_details[$key] = array(
                    'value' => $userMonster[$user_key],
                    'class' => 'correct-guess'
                );
            } else {
                $formatted_details[$key] = array(
                    'value' => $userMonster[$user_key],
                    'class' => 'incorrect-guess'
                );
            }
        }

        // Comparer les noms de cartes individuellement
        $formatted_details['maps'] = array();
        foreach ($user_maps as $user_map) {
            if (in_array($user_map, $correct_maps)) {
                $formatted_details['maps'][] = array(
                    'value' => $user_map,
                    'class' => 'correct-guess'
                );
            } else {
                $formatted_details['maps'][] = array(
                    'value' => $user_map,
                    'class' => 'incorrect-guess'
                );
            }
        }

        // Comparer size_min et size_max
        foreach (['size_min', 'size_max'] as $key) {
            $user_key = "user_" . $key;
            $correct_key = "correct_" . $key;
            if ($userMonster[$user_key] < $correctMonster[$correct_key]) {
                $formatted_details[$key] = array(
                    'value' => $userMonster[$user_key],
                    'class' => 'size-lower incorrect-guess',
                    'arrow' => '↑'
                );
            } elseif ($userMonster[$user_key] > $correctMonster[$correct_key]) {
                $formatted_details[$key] = array(
                    'value' => $userMonster[$user_key],
                    'class' => 'size-higher incorrect-guess',
                    'arrow' => '↓'
                );
            } else {
                $formatted_details[$key] = array(
                    'value' => $userMonster[$user_key],
                    'class' => 'correct-guess size'
                );
            }
        }

        // Déterminer si toutes les réponses sont correctes
        $all_correct = $response['correct_guess'];
        foreach (['name', 'type', 'color', 'description', 'image_path'] as $key) {
            $user_key = "user_" . $key;
            $correct_key = "correct_" . $key;
            if ($userMonster[$user_key] !== $correctMonster[$correct_key]) {
                $all_correct = false;
                break;
            }
        }
        foreach ($user_maps as $user_map) {
            if (!in_array($user_map, $correct_maps)) {
                $all_correct = false;
                break;
            }
        }

        foreach (['size_min', 'size_max'] as $key) {
            $user_key = "user_" . $key;
            $correct_key = "correct_" . $key;
            if ($userMonster[$user_key] !== $correctMonster[$correct_key]) {
                $all_correct = false;
                break;
            }
        }

        $response['all_correct'] = $all_correct;
        $response['user_monster'] = $formatted_details;
        $response['correct_monster'] = $correctMonster;

        return $response;
    }
}

// Initialiser la connexion à la base de données
$database = new Database();
$pdo = $database->connect();

// Créer une instance de l'API des monstres
$monsterAPI = new MonsterAPI($pdo);

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le paramètre 'name' est présent dans la requête GET
    if (isset($_GET['name'])) {
        $response = $monsterAPI->getMonsterDetails($_GET['name']);
        sendJsonResponse($response);
    } else {
        sendJsonResponse(array("message" => "Paramètre 'name' manquant."), 400);
    }
} else {
    sendJsonResponse(array("message" => "Méthode non autorisée."), 405);
}

// Fonction pour envoyer une réponse JSON
function sendJsonResponse($response, $code = 200) {
    http_response_code($code);
    echo json_encode($response);
}
?>
