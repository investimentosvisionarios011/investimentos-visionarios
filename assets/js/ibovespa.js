// ==========================================
// IBOVESPA - INVESTIMENTOS VISIONÁRIOS
// ==========================================

async function atualizarIbovespa() {

    console.log("📊 Iniciando atualização do Ibovespa...");

    try {

const resposta = await fetch("http://localhost:3000/api/ibovespa");

        console.log(
            "📡 Status da API do Ibovespa:",
            resposta.status
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        console.log(
            "📈 Dados recebidos do Ibovespa:",
            dados
        );

        // ==========================================
        // ELEMENTOS DO DASHBOARD
        // ==========================================

        const valorElemento =
            document.getElementById("dashboardIbov");

        const variacaoElemento =
            document.getElementById("dashboardIbovVariacao");

        // ==========================================
        // VERIFICA ELEMENTOS
        // ==========================================

        if (!valorElemento) {

            console.error(
                "❌ Elemento #dashboardIbov não encontrado!"
            );

            return;
        }

        // ==========================================
        // VALOR DO IBOVESPA
        // ==========================================

        let valor = Number(dados.preco);

        // Caso a API utilize outro nome
        if (!Number.isFinite(valor)) {
            valor = Number(dados.valor);
        }

        if (Number.isFinite(valor)) {

            valorElemento.textContent =
                valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });

            console.log(
                "✅ Valor do Ibovespa:",
                valor
            );

        } else {

            valorElemento.textContent = "--";

            console.error(
                "❌ Valor do Ibovespa inválido:",
                dados
            );
        }

        // ==========================================
        // VARIAÇÃO
        // ==========================================

        if (variacaoElemento) {

            const variacao =
                Number(dados.variacao);

            if (Number.isFinite(variacao)) {

                const seta =
                    variacao >= 0
                        ? "▲"
                        : "▼";

                variacaoElemento.textContent =
                    `${seta} ${Math.abs(variacao).toFixed(2)}%`;

                variacaoElemento.style.color =
                    variacao >= 0
                        ? "#16c45b"
                        : "#ff4d4d";

            } else {

                variacaoElemento.textContent = "--";
            }
        }

        // ==========================================
        // ATUALIZA A BARRA DE COTAÇÕES
        // ==========================================

        const ibovBarra =
            document.getElementById("ibov");

        if (ibovBarra && Number.isFinite(valor)) {

            ibovBarra.textContent =
                valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
        }

        console.log(
            "✅ Ibovespa atualizado com sucesso!"
        );

    } catch (erro) {

        console.error(
            "❌ Erro ao atualizar Ibovespa:",
            erro
        );

        const valorElemento =
            document.getElementById("dashboardIbov");

        const variacaoElemento =
            document.getElementById("dashboardIbovVariacao");

        if (valorElemento) {
            valorElemento.textContent = "--";
        }

        if (variacaoElemento) {
            variacaoElemento.textContent =
                "Indisponível";
        }
    }
}


// ==========================================
// EXECUTA QUANDO A PÁGINA CARREGAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    atualizarIbovespa
);


// ==========================================
// ATUALIZA A CADA 5 MINUTOS
// ==========================================

setInterval(
    atualizarIbovespa,
    5 * 60 * 1000
);