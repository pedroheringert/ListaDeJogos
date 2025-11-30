<?php

header("Content-Type: application/json");
require 'conexao.php';

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

if (!$id) {
    echo json_encode(['sucesso' => false, 'erro' => 'ID inválido']);
    exit;
}


try{

    $sql="SELECT * FROM jogos WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt -> bindParam(':id',$id);
    $stmt -> execute();

    $jogo = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($jogo);

} catch(PDOException $e)
{
    echo json_encode(['sucesso' => false, 'erro'=> $e->getMessage()]);
}

?>