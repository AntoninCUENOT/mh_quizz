<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inclure votre fichier de configuration de la base de données
require_once '../config.php';

// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['wallpaper'])) {
    $target_dir = '../../src/assets/monsters/images/wallpaper/';
    $file_name = "amatsu.jpg";
    $target_file = $target_dir . basename($file_name);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Vérifier si le fichier est une image réelle ou un faux fichier
    $check = getimagesize($_FILES["wallpaper"]["tmp_name"]);
    if ($check !== false) {
        // Vérifier la taille du fichier (par exemple, max 5MB)
        if ($_FILES["wallpaper"]["size"] > 5000000) {
            http_response_code(400); // Bad request
            echo json_encode(array('status' => 'error', 'message' => 'Sorry, your file is too large.'));
            exit;
        }

        // Autoriser certains formats de fichiers
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
            http_response_code(400); // Bad request
            echo json_encode(array('status' => 'error', 'message' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.'));
            exit;
        }

        // Déplacer le fichier téléchargé vers le répertoire cible
        if (move_uploaded_file($_FILES["wallpaper"]["tmp_name"], $target_file)) {
            // Chemin relatif du fichier dans votre projet
            $path = '../../src/assets/monsters/images/wallpaper/' . $file_name;

            // Insertion dans la base de données
            $stmt = $pdo->prepare("UPDATE wallpaper SET name = :name, path = :path WHERE id = 1");
            $stmt->bindParam(':name', $file_name);
            $stmt->bindParam(':path', $path);

            if ($stmt->execute()) {
                echo json_encode(array('status' => 'success', 'message' => 'File uploaded and saved in database.'));
            } else {
                http_response_code(500); // Internal Server Error
                echo json_encode(array('status' => 'error', 'message' => 'Error inserting into database.'));
            }
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(array('status' => 'error', 'message' => 'Sorry, there was an error uploading your file.'));
        }
    } else {
        http_response_code(400); // Bad request
        echo json_encode(array('status' => 'error', 'message' => 'File is not an image.'));
    }
} else {
    http_response_code(400); // Bad request
    echo json_encode(array('status' => 'error', 'message' => 'No file uploaded or invalid request.'));
}
?>
