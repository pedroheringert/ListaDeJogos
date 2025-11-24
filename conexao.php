<?php

$host = "sql312.infinityfree.com";
$db = "if0_40484455_db_lista_jogos";
$user = "if0_40484455";
$pass = "Lokifilho03";


try {

    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão: " . $e->getMessage());
}

?>