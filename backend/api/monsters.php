<?php
// api/monsters.php

// Permettre l'accès à partir de tous les domaines (à utiliser uniquement pour le développement local)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../config.php'; // Inclure le fichier de configuration de la base de données

// Fonction pour envoyer une réponse JSON
function sendJsonResponse($response, $code = 200) {
    http_response_code($code);
    echo json_encode($response);
}

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le paramètre 'name' est présent dans la requête GET
    if (isset($_GET['name'])) {
        $user_input = $_GET['name'];

        try {
            // Sélectionner le monstre correct avec ses détails (name, type, color)
            $query = "SELECT mc.name, mc.type, mc.color, GROUP_CONCAT(maps.name SEPARATOR ', ') AS maps
                      FROM monster_correct mc 
                      JOIN monster_map mm ON mc.id = mm.monster_id 
                      JOIN maps ON maps.id = mm.map_id
                      GROUP BY mc.id";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $correct_monster = $stmt->fetch(PDO::FETCH_ASSOC);

            // Sélectionner le monstre fourni par l'utilisateur avec ses détails (name, type, color)
            $query = "SELECT m.name, m.type, m.color, GROUP_CONCAT(maps.name SEPARATOR ', ') AS maps
                      FROM monsters m 
                      JOIN monster_map mm ON m.id = mm.monster_id 
                      JOIN maps ON maps.id = mm.map_id 
                      WHERE m.name = ?
                      GROUP BY m.id";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$user_input]);
            $user_monster = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user_monster) {
                // Préparer la réponse avec les détails du monstre correct et la comparaison avec l'input utilisateur
                $response = array();
                $response['correct_guess'] = ($user_input === $correct_monster['name']);

                // Formater les détails du monstre utilisateur pour l'affichage HTML avec les classes CSS appropriées
                $formatted_details = array();
                
                // Séparer les noms de cartes en un tableau
                $correct_maps = explode(', ', $correct_monster['maps']);
                $user_maps = explode(', ', $user_monster['maps']);
                
                foreach (['name', 'type', 'color'] as $key) {
                    if ($user_monster[$key] === $correct_monster[$key]) {
                        $formatted_details[$key] = array(
                            'value' => $user_monster[$key],
                            'class' => 'correct-guess'
                        );
                    } else {
                        $formatted_details[$key] = array(
                            'value' => $user_monster[$key],
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

                // Déterminer si toutes les réponses sont correctes
                $all_correct = $response['correct_guess'];
                foreach (['name', 'type', 'color'] as $key) {
                    if ($user_monster[$key] !== $correct_monster[$key]) {
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

                $response['all_correct'] = $all_correct;
                $response['user_monster'] = $formatted_details;
                $response['correct_monster'] = $correct_monster;

                sendJsonResponse($response);

            } else {
                // Aucun monstre trouvé avec ce nom
                sendJsonResponse(array("correct_guess" => false, "message" => "Monstre non trouvé."), 404);
            }
        } catch (PDOException $e) {
            sendJsonResponse(array("message" => "Erreur de base de données: " . $e->getMessage()), 500);
        }
    } else {
        sendJsonResponse(array("message" => "Paramètre 'name' manquant."), 400);
    }
} else {
    sendJsonResponse(array("message" => "Méthode non autorisée."), 405);
}
?>
