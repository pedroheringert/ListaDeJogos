<?php 
header("content-type: application/json");
require 'conexao.php';


if($_SERVER['REQUEST_METHOD']=== 'POST')
    {
        $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);


        if(!$id)
            {
                echo json_encode(['sucesso' => false, 'erro' => 'ID inválido']);
                exit;
            }

        try{

            $sql="DELETE FROM jogos WHERE id = :id";

            $stmt = $pdo->prepare($sql);
            $stmt -> bindValue(':id',$id);
            $stmt -> execute();

            echo json_encode(['sucesso' => true]);
        } catch(PDOException $e)
        {
            echo json_encode(['sucesso' => false, 'erro' => 'Erro ao excluir: '.$e->getMessage()]);
        }
    }


?>