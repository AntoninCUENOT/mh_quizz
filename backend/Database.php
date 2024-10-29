<?php
// Paramètres de connexion à la base de données
class Database {
    private $host = 'localhost';
    private $dbname = 'quizz_mh';
    private $username = 'root';
    private $password = '';
    private $pdo;

    // Connexion à la base de données avec PDO
    public function connect() {
        if ($this->pdo == null) {
            try {
                $this->pdo = new PDO("mysql:host={$this->host};dbname={$this->dbname};charset=utf8", $this->username, $this->password);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                error_log("Erreur de connexion à la base de données : " . $e->getMessage());
            }
        }
        return $this->pdo;
    }
}
?>
