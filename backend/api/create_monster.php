<?php
// Inclure le fichier de configuration pour la connexion à la base de données
require_once('../config.php');

// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: POST');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
// Répondre aux requêtes pré-vérification (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Récupérer les données POST envoyées depuis le formulaire
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$type_id = isset($_POST['type_id']) ? intval($_POST['type_id']) : null;
$color = isset($_POST['color']) ? trim($_POST['color']) : '';
$size_min = isset($_POST['size_min']) ? intval($_POST['size_min']) : null;
$size_max = isset($_POST['size_max']) ? intval($_POST['size_max']) : null;
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$maps = isset($_POST['maps']) ? json_decode($_POST['maps'], true) : [];

// Validation des données
if (empty($name) || empty($type_id) || empty($maps)) {
    http_response_code(400); // Bad request
    die(json_encode(['error' => 'Missing required fields']));
}

// Définir le dossier de téléchargement des fichiers
$uploadDir = '../../src/assets/monsters/';

// Fonction pour gérer le téléchargement des fichiers
function handleFileUpload($file, $uploadDir, $name) {
    // Vérifier et créer le répertoire si nécessaire
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = $name . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return $targetPath;
    } else {
        return null;
    }
}

// Gérer le téléchargement de l'image
$image_path = '';
if (isset($_FILES['image'])) {
    $image_path = handleFileUpload($_FILES['image'], $uploadDir . 'images/', $name);
}

// Gérer le téléchargement du son
$sound_path = '';
if (isset($_FILES['sound'])) {
    $sound_path = handleFileUpload($_FILES['sound'], $uploadDir . 'sounds/', $name);
}

// Gérer le téléchargement du thème
$theme_path = '';
if (isset($_FILES['theme'])) {
    $theme_path = handleFileUpload($_FILES['theme'], $uploadDir . 'themes/', $name);
}

try {
    // Début de la transaction pour assurer l'intégrité des données
    $pdo->beginTransaction();

    // Insertion du monstre dans la table `monsters`
    $sql = "INSERT INTO monsters (name, type_id, color, size_min, size_max, description, image_path, sound_path, theme_path)
            VALUES (:name, :type_id, :color, :size_min, :size_max, :description, :image_path, :sound_path, :theme_path)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':type_id', $type_id);
    $stmt->bindParam(':color', $color);
    $stmt->bindParam(':size_min', $size_min);
    $stmt->bindParam(':size_max', $size_max);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':image_path', $image_path);
    $stmt->bindParam(':sound_path', $sound_path);
    $stmt->bindParam(':theme_path', $theme_path);
    $stmt->execute();

    // Récupérer l'ID du monstre inséré
    $monsterId = $pdo->lastInsertId();

    // Insertion des associations dans la table `monster_map`
    $sql = "INSERT INTO monster_map (monster_id, map_id) VALUES (:monster_id, :map_id)";
    $stmt = $pdo->prepare($sql);

    foreach ($maps as $mapId) {
        $stmt->bindParam(':monster_id', $monsterId);
        $stmt->bindParam(':map_id', $mapId);
        $stmt->execute();
    }

    // Valider la transaction
    $pdo->commit();

    // Répondre avec succès
    http_response_code(200);
    echo json_encode(['message' => 'Monster created successfully', 'monster_id' => $monsterId]);

} catch (PDOException $e) {
    // En cas d'erreur, annuler la transaction et renvoyer une erreur
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create monster: ' . $e->getMessage()]);
}
?>
