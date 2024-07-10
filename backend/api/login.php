<?php

// Autoriser l'accès depuis n'importe quel domaine
header('Access-Control-Allow-Origin: *');
// Autoriser les méthodes que vous utilisez (POST dans votre cas)
header('Access-Control-Allow-Methods: POST');
// Autoriser les en-têtes personnalisés et les en-têtes requis pour la requête
header('Access-Control-Allow-Headers: Content-Type');
session_start();
require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = htmlspecialchars($data['username']);
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    $_SESSION['id'] = $user['id'];
    $_SESSION['role'] = $user['role']; // Assurez-vous que le rôle est récupéré depuis la base de données
    echo json_encode(['success' => true, 'role' => $user['role'], 'id' => $user['id']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
?>
