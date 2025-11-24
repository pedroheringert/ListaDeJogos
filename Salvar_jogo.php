<?php

header("content-type: application/json");
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = isset($_POST['nome']) ? htmlspecialchars($_POST['nome']) : null;
    $capa = isset($_POST['capa']) ? filter_var($_POST['capa'], FILTER_SANITIZE_URL) : null;
    $status = isset($_POST['status']) ? htmlspecialchars($_POST['status']) : null;
    $rotulo = isset($_POST['rotulo']) ? htmlspecialchars($_POST['rotulo']) : null;

    if (!$nome) {
        echo json_encode(['sucesso' => false, 'erro' => 'nome inválido']);
        exit;
    }



    $sql = "INSERT INTO jogos (nome, capa, status, rotulo) VALUES (:nome, :capa, :status, :rotulo)";

    try {
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':capa', $capa);
        $stmt->bindvalue(':status', $status);
        $stmt->bindValue(':rotulo', $rotulo);

        $stmt->execute();

        echo json_encode(['sucesso' => true, 'mensagem' => 'jogo salvo com sucesso!']);

    } catch (PDOException $e) {
        error_log($e->getMessage());
        echo json_encode(['sucesso' => false, 'erro' => 'Erro ao gravar no banco']);
    }
}

?>