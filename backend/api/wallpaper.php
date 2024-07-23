<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../Database.php'; // Inclure le fichier de configuration de la base de données

class WallpaperUploader {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function uploadFile($file) {
        $targetDir = '../../src/assets/monsters/images/wallpaper/';
        $fileName = "wallpaper.jpg";
        $targetFile = $targetDir . $fileName;
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Vérifier si le fichier est une image réelle ou un faux fichier
        $check = getimagesize($file["tmp_name"]);
        if ($check === false) {
            throw new Exception('File is not an image.');
        }

        // Vérifier la taille du fichier (par exemple, max 5MB)
        if ($file["size"] > 5000000) {
            throw new Exception('Sorry, your file is too large.');
        }

        // Autoriser certains formats de fichiers
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
            throw new Exception('Sorry, only JPG, JPEG, PNG & GIF files are allowed.');
        }

        // Déplacer le fichier téléchargé vers le répertoire cible
        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            $path = './src/assets/monsters/images/wallpaper/' . $fileName;

            // Insertion dans la base de données
            $query = $this->pdo->prepare("UPDATE wallpaper SET name = :name, path = :path WHERE id = 1");
            $query->bindParam(':name', $fileName);
            $query->bindParam(':path', $path);

            if ($query->execute()) {
                return ['status' => 'success', 'message' => 'File uploaded and saved in database.'];
            } else {
                throw new Exception('Error inserting into database.');
            }
        } else {
            throw new Exception('Error uploading file.');
        }
    }
}

// Vérifier la méthode de requête HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['wallpaper'])) {
    try {
        $database = new Database();
        $pdo = $database->connect();

        $uploader = new WallpaperUploader($pdo);
        $result = $uploader->uploadFile($_FILES['wallpaper']);

        http_response_code(200);
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No file uploaded or invalid request.']);
}
?>
