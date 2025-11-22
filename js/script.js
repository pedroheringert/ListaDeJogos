const listaDeJogos = [
    {
        nome: "Red Dead Redemption 2",
        capa: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
        status: "jogando",
        rotulo: "Jogando Agora"
    },
    {
        nome: "Minecraft",
        capa: "https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg",
        status: "pendente",
        rotulo: "Vamos Jogar"
    },
    {
        nome: "Elden Ring",
        capa: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png",
        status: "zerado",
        rotulo: "Zeramos"
    }
];


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
    exibirJogos(listaDeJogos);


    $('#btn-buscar').click(function()
    {
        const nomeJogo=$('#nome').val();
        
        const api='395b8254e7bb4ceeb78a24447dae43b4';

        if(nomeJogo==='')
            {
                alert('Digite o nome do jogo primeiro!');
                return;
            }

        const botao = $(this);
        const textoOriginal = botao.text();
        botao.text('Buscando...').prop('disabled',true);

        const url = `https://api.rawg.io/api/games?key=${api}&search=${nomeJogo}`;

        $.ajax({
            url: url,
            method: 'GET',
            success: function(resposta) 
            {
                if(resposta.results.length>0)
                    {
                        const jogo = resposta.results[0];

                        $('#img-preview').attr('src',jogo.background_image);

                        $('#url-imagem-final').val(jogo.background_image);

                        $('#nome').val(jogo.name);

                    }
                else 
                    {
                        alert('Jogo não encontrado! tente outro nome!');
                    }

                
            },
        
        error: function()
        {
            alert('Erro de conexão. Verifique a internet!');
        },

        complete: function() {
                
                botao.text(textoOriginal).prop('disabled', false);
            }
        });

    });

});



