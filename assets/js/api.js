// ================================
// COTAÇÕES EM TEMPO REAL
// ================================

async function atualizarCotacoes() {

    try {

        const resposta = await fetch(
            "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL"
        );

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        console.log("Dados recebidos da API:", dados);


        // ================================
        // DÓLAR
        // ================================

        if (dados.USDBRL && dados.USDBRL.bid) {

            const dolar = Number(dados.USDBRL.bid);

            document.getElementById("dolar").innerHTML =
                "R$ " + dolar.toFixed(2).replace(".", ",");

            const dolarVar =
                Number(dados.USDBRL.pctChange || 0);

            const elementoDolar =
                document.getElementById("dolarVariacao");

            if (elementoDolar) {

                elementoDolar.innerHTML =
                    `${dolarVar >= 0 ? "▲" : "▼"} ${Math.abs(dolarVar).toFixed(2)}%`;

                elementoDolar.style.color =
                    dolarVar >= 0
                        ? "#16c45b"
                        : "#ff4d4d";
            }


            // ================================
            // DASHBOARD - DÓLAR
            // ================================

            const dashboardDolar =
                document.getElementById("dashboardDolar");

            if (dashboardDolar) {

                dashboardDolar.innerHTML =
                    "R$ " +
                    dolar.toFixed(2).replace(".", ",");

            }


            const dashboardDolarVariacao =
                document.getElementById("dashboardDolarVariacao");

            if (dashboardDolarVariacao) {

                dashboardDolarVariacao.innerHTML =
                    `${dolarVar >= 0 ? "▲" : "▼"} ${Math.abs(dolarVar).toFixed(2)}%`;

                dashboardDolarVariacao.style.color =
                    dolarVar >= 0
                        ? "#16c45b"
                        : "#ff4d4d";

            }

        }


        // ================================
        // EURO
        // ================================

        if (dados.EURBRL && dados.EURBRL.bid) {

            const euro = Number(dados.EURBRL.bid);

            document.getElementById("euro").innerHTML =
                "R$ " + euro.toFixed(2).replace(".", ",");

            const euroVar =
                Number(dados.EURBRL.pctChange || 0);

            const elementoEuro =
                document.getElementById("euroVariacao");

            if (elementoEuro) {

                elementoEuro.innerHTML =
                    `${euroVar >= 0 ? "▲" : "▼"} ${Math.abs(euroVar).toFixed(2)}%`;

                elementoEuro.style.color =
                    euroVar >= 0
                        ? "#16c45b"
                        : "#ff4d4d";

            }


            // ================================
            // DASHBOARD - EURO
            // ================================

            const dashboardEuro =
                document.getElementById("dashboardEuro");

            if (dashboardEuro) {

                dashboardEuro.innerHTML =
                    "R$ " +
                    euro.toFixed(2).replace(".", ",");

            }


            const dashboardEuroVariacao =
                document.getElementById("dashboardEuroVariacao");

            if (dashboardEuroVariacao) {

                dashboardEuroVariacao.innerHTML =
                    `${euroVar >= 0 ? "▲" : "▼"} ${Math.abs(euroVar).toFixed(2)}%`;

                dashboardEuroVariacao.style.color =
                    euroVar >= 0
                        ? "#16c45b"
                        : "#ff4d4d";

            }

        }


        // ================================
        // BITCOIN
        // ================================

        if (dados.BTCBRL && dados.BTCBRL.bid) {

            const bitcoin = Number(dados.BTCBRL.bid);

            document.getElementById("bitcoin").innerHTML =
                "R$ " +
                bitcoin.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

            const btcVar =
                Number(dados.BTCBRL.pctChange || 0);

            const elementoBitcoin =
                document.getElementById("bitcoinVariacao");

            if (elementoBitcoin) {

                elementoBitcoin.innerHTML =
                    `${btcVar >= 0 ? "▲" : "▼"} ${Math.abs(btcVar).toFixed(2)}%`;

                elementoBitcoin.style.color =
                    btcVar >= 0
                        ? "#16c45b"
                        : "#ff4d4d";

            }


            // ================================
            // DASHBOARD - BITCOIN
            // ================================

            const dashboardBitcoin =
                document.getElementById("dashboardBitcoin");

            if (dashboardBitcoin) {

                dashboardBitcoin.innerHTML =
                    "R$ " +
                    bitcoin.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

            }


            const dashboardBitcoinVariacao =
                document.getElementById("dashboardBitcoinVariacao");

            if (dashboardBitcoinVariacao) {

                dashboardBitcoinVariacao.innerHTML =
                    `${btcVar >= 0 ? "▲" : "▼"} ${Math.abs(btcVar).toFixed(2)}%`;

                dashboardBitcoinVariacao.style.color =
                    btcVar >= 0
                        ? "#16c45b"
                        : "#ff4d4d";

            }

        }


        // ================================
        // HORÁRIO DA ATUALIZAÇÃO
        // ================================

        const agora = new Date();

        const horario =
            agora.toLocaleTimeString("pt-BR");

        const elementoHorario =
            document.getElementById("ultimaAtualizacao");

        if (elementoHorario) {

            elementoHorario.innerHTML =
                horario;

        }


        // ================================
        // STATUS DAS COTAÇÕES
        // ================================

        const status =
            document.getElementById("statusCotacoes");

        if (status) {

            status.innerHTML =
                "● Cotações atualizadas";

            status.style.color =
                "#16c45b";

        }


        console.log(
            "Cotações atualizadas com sucesso!"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar as cotações:",
            erro
        );


        // ================================
        // STATUS DE ERRO
        // ================================

        const status =
            document.getElementById("statusCotacoes");

        if (status) {

            status.innerHTML =
                "● Erro ao atualizar cotações";

            status.style.color =
                "#ff4d4d";

        }

    }

}


// ================================
// PRIMEIRA ATUALIZAÇÃO
// ================================

atualizarCotacoes();


// ================================
// ATUALIZAÇÃO AUTOMÁTICA
// A cada 60 segundos
// ================================

setInterval(
    atualizarCotacoes,
    60000
);