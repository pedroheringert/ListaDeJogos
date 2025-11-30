<?php

header("Content-Type: application/json");
require 'conexao.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);

    
    $nome = isset($_POST['nome']) ? htmlspecialchars($_POST['nome']) : null;
    $capa = isset($_POST['capa']) ? filter_var($_POST['capa'], FILTER_SANITIZE_URL) : null;
    $status = isset($_POST['status']) ? htmlspecialchars($_POST['status']) : null;
    $rotulo = isset($_POST['rotulo']) ? htmlspecialchars($_POST['rotulo']) : null;

    if (!$id || !$nome) {
        echo json_encode(['sucesso' => false, 'erro' => 'Dados inválidos']);
        exit;
    }


    $sql = "UPDATE jogos SET nome = :nome, capa = :capa, status = :status, rotulo = :rotulo WHERE id = :id";

    try{
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':capa', $capa);
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':rotulo', $rotulo);
        $stmt->bindValue(':id', $id);
        
        $stmt->execute();

        echo json_encode(['sucesso' => true]);

    } catch(PDOException $e)
    {
        echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
    }

}





?>