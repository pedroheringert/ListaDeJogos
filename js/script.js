function carregarJogosBanco() {
    const container = $('#jogos');

    if (container.length === 0) return;

    container.html('<p style="color:#aaa; text-align:center; margin-top:20px">Carregando Lista de jogos...</p>');

    $.ajax({
        url: 'listar_jogos.php',
        method: 'GET',
        dataType: 'json',
        success: function (lista) {
            exibirJogos(lista);
        },
        error: function () {
            container.html('<p style="color:red; text-align:center">Erro ao conectar com o servidor.</p>');
        }
    });
}

function exibirJogos(lista) {
    const container = $('#jogos');
    container.empty();

    if (lista.length === 0) {
        container.html('<p style="color:white; width:100%; text-align:center">Nenhum jogo encontrado.</p>');
        return;
    }

    $.each(lista, function (index, jogo) {
        const card = `
            <div class="card-jogo">
                <div class="capa" style="background-image: url('${jogo.capa}');"></div>
                <div class="info">
                    <h3>${jogo.nome}</h3>
                    <span class="status ${jogo.status}">${jogo.rotulo}</span>
                    
                    <div class="acoes-card">
                         <button type="button" class="btn-editar" data-id="${jogo.id}">✏️</button>
                         <button type="button" class="btn-excluir" data-id="${jogo.id}">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        container.append(card);
    });
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idEdicao = urlParams.get('id');

    if (idEdicao) {
        $('h2').text('Editar Jogo');
        $('.btn-salvar').text('Atualizar');

        $.ajax({
            url: 'buscar_jogo.php',
            method: 'GET',
            data: { id: idEdicao },
            dataType: 'json',
            success: function(jogo) {
                $('#id-jogo').val(jogo.id);
                $('#nome').val(jogo.nome);
                $('#status').val(jogo.status);
                $('#url-imagem-final').val(jogo.capa);
                $('#img-preview').attr('src', jogo.capa);
            }
        });
    } else {
        carregarJogosBanco();
    }

    $('#btn-buscar').click(function () {
        const nomeJogo = $('#nome').val();
        const api = '395b8254e7bb4ceeb78a24447dae43b4';

        if (nomeJogo === '') {
            alert('Digite o nome do jogo primeiro!');
            return;
        }

        const botao = $(this);
        const textoOriginal = botao.text();
        botao.text('Buscando...').prop('disabled', true);

        const url = `https://api.rawg.io/api/games?key=${api}&search=${nomeJogo}`;

        $.ajax({
            url: url,
            method: 'GET',
            success: function (resposta) {
                if (resposta.results.length > 0) {
                    const jogo = resposta.results[0];
                    $('#img-preview').attr('src', jogo.background_image);
                    $('#url-imagem-final').val(jogo.background_image);
                    $('#nome').val(jogo.name);
                } else {
                    alert('Jogo não encontrado! Tente outro nome!');
                }
            },
            error: function () {
                alert('Erro de conexão. Verifique a internet!');
            },
            complete: function () {
                botao.text(textoOriginal).prop('disabled', false);
            }
        });
    });

    $('#jogos').on('click', '.btn-excluir', function () {
        const idDoJogo = $(this).data('id');

        if (!confirm("Tem certeza que quer excluir esse jogo?")) {
            return;
        }

        $.ajax({
            url: 'excluir_jogo.php',
            method: 'POST',
            data: { id: idDoJogo },
            dataType: 'json',
            success: function (resposta) {
                if (resposta.sucesso) {
                    carregarJogosBanco();
                    alert("Jogo excluído!");
                } else {
                    alert("Erro ao excluir: " + resposta.erro);
                }
            },
            error: function () {
                alert("Erro de conexão ao tentar excluir.");
            }
        });
    });

    $('#jogos').on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        window.location.href = `adicionar.html?id=${id}`;
    });

    $('#form-jogo').submit(function (evento) {
        evento.preventDefault();
        const id = $('#id-jogo').val(); 
        let urlDestino = 'Salvar_jogo.php';
        if (id) {
            urlDestino = 'editar_jogo.php';
        }
        const dados = {
            id: id,
            nome: $('#nome').val(),
            capa: $('#url-imagem-final').val() || 'https://placehold.co/600x400?text=Sem+Capa',
            status: $('#status').val(),
            rotulo: $('#status option:selected').text()
        };
        const btnSalvar = $('.btn-salvar');
        btnSalvar.html('Processando...').prop('disabled', true);
        $.ajax({
            url: urlDestino,
            method: 'POST',
            dataType: 'json',
            data: dados,
            success: function (resposta) {
                if (resposta.sucesso) {
                    alert('Operação realizada com sucesso!');
                    window.location.href = 'index.html';
                } else {
                    alert('Erro: ' + (resposta.erro || resposta.mensagem));
                }
            },
            error: function () {
                alert('Erro grave de comunicação com o servidor.');
            },
            complete: function () {
                btnSalvar.text('Salvar').prop('disabled', false);
            }
        });
    });
});