<?php
// config/db.php
$host = 'localhost';
$dbname = 'todesign';
$username = 'root'; // Change to your DB user
$password = ''; // Change to your DB password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>