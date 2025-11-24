<?php

header("content-type: application/json");
require 'conexao.php';


try{
    
    $sql = "SELECT * FROM jogos ORDER BY id DESC";

    $stmt = $pdo->query($sql);

    $lista = $stmt ->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($lista);
} catch(PDOException $e)
{
    echo json_encode([]);
}

?>