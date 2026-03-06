$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = []

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 7;
var MEU_ENDERECO= null;

var CELULAR_EMPRESA = '5583991234567';

var INSTA = 'https://www.instagram.com/'
var FACE = 'https://www.facebook.com/'




cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaosocial();
    }
}



cardapio.metodos = {

    //obtem a lista de itens do cardápio
    obterItensCardapio: (categoria ='burgers', vermais = false) => {
        var filtro = MENU[categoria];
        console.log(filtro);

        if(!vermais) {
            $("#itensCardapio").html('')
            $("#btnVerMAis").removeClass('hidden');
        }

        $.each(filtro, (i,e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id)

            //se o botão "Ver Mais" for clicado
            if(vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }

            //Set inicial (8 itens)
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }

            
        })

        //remove o active
        $(".container-menu a").removeClass('active');

        //ativa o active
        $("#menu-" + categoria).addClass('active')
    },

    //clique no botão de ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo,true);

        $("#btnVerMAis").addClass('hidden');
    },

    //diminui a quantidade do item no card do cardapio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual-1)
        }
    },

    //aumenta a quantidade do item no card do cardapio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    //adiciona o item do card do cardapio ao carrinho
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            let filtro = MENU[categoria];

            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                if (existe.length > 0 ) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado com sucesso', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }
        }
    },

    // Atualiza os dois valores das badges do carrinho
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if(total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    //abre a modal do carrinho
    abrirCarrinho: (abrir) => {

        if(abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    //Manipula a section Etapas (etapas 1, 2 e 3)
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $('#itensCarrinho').removeClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');

            $('#tbnEtapaPedido').removeClass('hidden');
            $('#tbnEtapaEndereco').addClass('hidden');
            $('#tbnEtapaResumo').addClass('hidden');
            $('#tbnVoltar').addClass('hidden');
        }
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').removeClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');

            $('#tbnEtapaPedido').addClass('hidden');
            $('#tbnEtapaEndereco').removeClass('hidden');
            $('#tbnEtapaResumo').addClass('hidden');
            $('#tbnVoltar').removeClass('hidden');

        }
        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').removeClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');
            $('.etapa3').addClass('active');

            $('#tbnEtapaPedido').addClass('hidden');
            $('#tbnEtapaEndereco').addClass('hidden');
            $('#tbnEtapaResumo').removeClass('hidden');
            $('#tbnVoltar').removeClass('hidden');

        }

    },

    //Botão de voltar na modal Carrinho
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;

        cardapio.metodos.carregarEtapa(etapa - 1);
    },

    //carrega a lista de itens do carrinho
    carregarCarrinho: () => {
        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {
            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }
            })
        }
        else {
            $("#itensCarrinho").html('<p class ="carrinho-vazio"> <i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }
    },

    //diminui a quantidade de itens dentro da modal Carrinho
    diminuirQuantidadeCarrinho: (id) => {
        
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else  {
            cardapio.metodos.removerItemCarrinho(id)
        }
    },

    //aumenta a quantidade de itens dentro da modal Carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },

    //remove o itens dentro da modal Carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) =>{ return e.id != id});
        cardapio.metodos.carregarCarrinho();

        cardapio.metodos.atualizarBadgeTotal();
    },

    //atualiza a variavel MEU_CARRINHO co a quantidade atual
    atualizarCarrinho: (id, qntd) => {
         let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
         MEU_CARRINHO[objIndex].qntd = qntd;

         cardapio.metodos.atualizarBadgeTotal();
         cardapio.metodos.carregarValores();
    },

    //carrega os valores de subtotal, entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i +1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);
            }
        })

    },

    //carrega a segunda etapa do carrinho
    carregarEndereco: () => {

        if(MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        }

        cardapio.metodos.carregarEtapa(2);

    },

    //API ViaCEP
    buscarCep: () => {
        var cep = $('#txtCEP').val().trim().replace(/\D/g,'');

        if(cep != '') {

            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (dados) {

                    if (!("erro" in dados)) {
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtNumero").focus();
                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente')
                        $('#txtEndereco').focus();
                    }
                })
            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.')
                $('#txtCEP').focus();
            }
        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.')
            $('#txtCEP').focus();
        }
    },

    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $('#txtCEP').val().trim();
        let endereco = $('#txtEndereco').val().trim();
        let bairro = $('#txtBairro').val().trim();
        let cidade = $('#txtCidade').val().trim();
        let uf = $('#ddlUF').val().trim();
        let numero = $('#txtNumero').val().trim();
        let complemento = $('#txtComplemento').val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor');
            $('#txtCEP').focus();
            return;
        }
        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor');
            $('#txtEndereco').focus();
            return;
        }
        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor');
            $('#txtBairro').focus();
            return;
        }
        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe o Cidade, por favor');
            $('#txtCidade').focus();
            return;
        }
        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe o UF, por favor');
            $('#txtddlUF').focus();
            return;
        }
        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Numero, por favor');
            $('#txtNumero').focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
    },

    // Carrega a ultima etapa da modal Carrinho
    carregarResumo: () => {
        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);
        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`); 
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} (${MEU_ENDERECO.complemento})`);

        cardapio.metodos.finalizarPedido();

    },

    //atualiza o link do botão do WhatsApp
    finalizarPedido: () => {

        if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
            var texto = 'Olá gostaria de fazer um pedido';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} (${MEU_ENDERECO.bairro})`;
            texto += `\n\n*Sub-Total : R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}*`;
            texto += `\n\n*Entrega : R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}*\n`;
            texto += `--------------------`
            texto += `\n\n*Total : R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.',',')} \n`

                if ((i + 1) == MEU_CARRINHO.length) {
                    texto = texto.replace(/\${itens}/g, itens);
                    
                    let encode = encodeURI(texto);
                    let URL = `http://wa.me/${CELULAR_EMPRESA}?text=${encode}`

                    $("#tbnEtapaResumo").attr('href', URL);
                }
                
            })
        }

    },

    // carrega o link do botão na section Reserva
    carregarBotaoReserva: () => {
        var texto = 'Olá, gostaria de fazer uma *Reserva*';
        let encode = encodeURI(texto);

        let URL = `http://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    // funcionamento do botão "ligar" do banner
    carregarBotaoLigar: () => {
        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);
    },

    // rolagem dos depoimentos
    abrirDepoimento: (depoimento) => {
        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#depoimento-" + depoimento).addClass('active');

    },

    // encaminhamento dos botões sociais
    carregarBotaosocial: () => {

        var texto = 'Olá, vim pelo site';
        let encode = encodeURI(texto);

        let URL = `http://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnSocialInsta").attr('href', `${INSTA}`);
        $("#btnSocialFace").attr('href', `${FACE}`);
        $("#btnSocialWpp").attr('href', URL);

        $("#btnSocialInstaFooter").attr('href', `${INSTA}`);
        $("#btnSocialFaceFooter").attr('href', `${FACE}`);
        $("#btnSocialWppFooter").attr('href', URL);
    },

    // aparece a mensagem de confirmaçao
    mensagem: (texto, cor = 'red', tempo = 3000) => {

        let id = Math.floor(Date.now() * Math.random()) .toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
            
        }, tempo)
    },  

}

cardapio.templates = {

    item: 
        `<div class="col-12 col-lg-3 col-md-3 col-sm-06 mb-5 animated fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>`,

    itemCarrinho:
        `<div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>R$ \${price}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fa fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
            </div>
        </div>`,

    itemResumo:
        `<div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}">
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${name}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${price}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>`
}