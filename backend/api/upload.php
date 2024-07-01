<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Chemin où seront stockés les fichiers uploadés
$uploadDir = '../src/assets/monsters/';

// Vérifier si le dossier d'upload existe sinon le créer
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Récupérer le type de fichier depuis la requête GET
$fileType = $_GET['type'];

// Récupérer le fichier envoyé
$file = $_FILES['file'];

// Récupérer le nom du monstre depuis le POST
$monsterName = $_POST['name']; // Assurez-vous d'ajuster ceci en fonction de comment vous envoyez le nom du monstre depuis React

// Construire le nouveau nom de fichier avec le nom du monstre et l'extension d'origine
$originalFileName = basename($file['name']);
$extension = pathinfo($originalFileName, PATHINFO_EXTENSION);
$newFileName = $monsterName . '_' . time() . '.' . $extension;

// Chemin complet du fichier
$filePath = $uploadDir . $newFileName;

// Déplacer le fichier uploadé vers le répertoire final en le renommant
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Retourner le chemin d'accès complet du fichier
    echo json_encode(['filePath' => $filePath]);
} else {
    // Gérer l'erreur d'upload
    http_response_code(500);
    echo json_encode(['error' => 'Failed to upload file']);
}
?>
