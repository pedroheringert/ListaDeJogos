function carregarJogosBanco() {
    const container = $('#jogos');

    if (container.length === 0) return;

    container.html('<p style="color:#aaa; text-align:center; margin-top:20px">Carregando Lista de jogos</p>');

    $.ajax({
        url: 'listar_jogos.php',
        method: 'GET',
        datatype: 'json',
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
                </div>
            </div>
        `;

        container.append(card);
    });

}


$(document).ready(function () {
    carregarJogosBanco();


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

                }
                else {
                    alert('Jogo não encontrado! tente outro nome!');
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

});


$('#form-jogo').submit(function (evento) {
    evento.preventDefault();

    const dados = {

        nome: $('#nome').val(),
        capa: $('#url-imagem-final').val() || 'https://placehold.co/600x400?text=Sem+Capa',
        status: $('#status').val(),
        rotulo: $('#status option:selected').text()

    }


    const btnSalvar = $('.btn-salvar');
    btnSalvar.html('Salvando no banco...').prop('disabled',true);


    $.ajax({
        url: 'Salvar_jogo.php',
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function (resposta)
        {
            if(resposta.sucesso)
                {
                    alert('sucesso!' + resposta.mensagem);
                    window.location.href = 'index.html';
                } else 
                    {
                        alert('Erro do PHP'+ resposta.erro);
                    }
        },
        error: function()
        {
            alert('Erro grave ao tentar atualizar o banco!');
        },
        complete: function ()
        {
            btnSalvar.text('Adicionar à lista').prop('disabled', false);
        }
    });    

});