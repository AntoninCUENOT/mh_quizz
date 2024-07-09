<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=UTF-8");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// require_once '../config.php';

// // Lire les données JSON envoyées dans le corps de la requête
// $data = json_decode(file_get_contents("php://input"));

// error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
// error_log("Data: " . json_encode($data));

// if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($data->id)) {
//     $id = $data->id;

//     // Rechercher le chemin du fichier à supprimer
//     $stmt = $pdo->prepare("SELECT path FROM wallpaper WHERE id = :id");
//     $stmt->bindParam(':id', $id, PDO::PARAM_INT);
//     $stmt->execute();
//     $result = $stmt->fetch(PDO::FETCH_ASSOC);

//     if ($result) {
//         $file_path = $result['path']; // Assurez-vous que le chemin est correct

//         error_log("File path: " . $file_path);
//         error_log("File exists: " . (file_exists($file_path) ? "Yes" : "No"));

//         if ($file_path && file_exists($file_path) && unlink($file_path)) {
//             error_log("File delete result: Success");

//             $stmt = $pdo->prepare("DELETE FROM wallpaper WHERE id = :id");
//             $stmt->bindParam(':id', $id, PDO::PARAM_INT);

//             if ($stmt->execute()) {
//                 echo json_encode(array('status' => 'success', 'message' => 'Image deleted successfully.'));
//             } else {
//                 http_response_code(500);
//                 echo json_encode(array('status' => 'error', 'message' => 'Failed to delete image from database.'));
//             }
//         } else {
//             error_log("File delete result: Fail");

//             http_response_code(500);
//             echo json_encode(array('status' => 'error', 'message' => 'Failed to delete file from server.'));
//         }
//     } else {
//         http_response_code(404);
//         echo json_encode(array('status' => 'error', 'message' => 'Image not found.'));
//     }
// } else {
//     http_response_code(400);
//     echo json_encode(array('status' => 'error', 'message' => 'Invalid request.'));
// }
?>
