<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=UTF-8");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// require_once '../config.php';

// // Lire les données JSON envoyées dans le corps de la requête
// $data = json_decode(file_get_contents("php://input"));

// if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data->id)) {
//     $id = $data->id;

//     // Définir tous les fonds d'écran comme inactifs
//     $pdo->query("UPDATE wallpaper SET is_active = FALSE");

//     // Définir le fond d'écran sélectionné comme actif
//     $stmt = $pdo->prepare("UPDATE wallpaper SET is_active = TRUE WHERE id = :id");
//     $stmt->bindParam(':id', $id, PDO::PARAM_INT);

//     if ($stmt->execute()) {
//         echo json_encode(array('status' => 'success', 'message' => 'Active wallpaper updated successfully.'));
//     } else {
//         http_response_code(500);
//         echo json_encode(array('status' => 'error', 'message' => 'Failed to update active wallpaper.'));
//     }
// } else {
//     http_response_code(400);
//     echo json_encode(array('status' => 'error', 'message' => 'Invalid request.'));
// }
?>
