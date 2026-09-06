// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// GRÁFICO HISTÓRICO DO BITCOIN
// ==========================================

let graficoBitcoin = null;


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarDataBitcoin(timestamp, periodo) {

    const data = new Date(timestamp);

    if (periodo === "5d") {

        return data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

    }

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    });

}


// ==========================================
// CARREGAR GRÁFICO DO BITCOIN
// ==========================================

async function carregarGraficoBitcoin(periodo = "1mo") {

    try {

        const resposta = await fetch(
            `/api/bitcoin/historico?periodo=${periodo}`
        );

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }

        const dados = await resposta.json();


        // ==========================================
        // VERIFICAR DADOS
        // ==========================================

        if (
            !dados.pontos ||
            !Array.isArray(dados.pontos) ||
            dados.pontos.length === 0
        ) {

            throw new Error(
                "Nenhum dado histórico encontrado."
            );

        }


        // ==========================================
        // REMOVER PREÇOS INVÁLIDOS OU ZERADOS
        // ==========================================

        const pontosValidos =
            dados.pontos.filter(ponto => {

                const preco =
                    Number(ponto.preco);

                return (
                    Number.isFinite(preco) &&
                    preco > 0
                );

            });


        if (pontosValidos.length === 0) {

            throw new Error(
                "Nenhum preço válido encontrado."
            );

        }


        // ==========================================
        // PREPARAR DATAS
        // ==========================================

        const labels =
            pontosValidos.map(
                ponto =>
                    formatarDataBitcoin(
                        ponto.data,
                        periodo
                    )
            );


        // ==========================================
        // PREPARAR PREÇOS
        // ==========================================

        const precos =
            pontosValidos.map(
                ponto =>
                    Number(ponto.preco)
            );


        // ==========================================
        // INDICADORES DO PERÍODO
        // ==========================================

        const primeiroValor =
            precos[0];

        const ultimoValor =
            precos[
                precos.length - 1
            ];


        let variacaoPeriodo = 0;


        if (primeiroValor !== 0) {

            variacaoPeriodo =
                (
                    (ultimoValor - primeiroValor)
                    / primeiroValor
                ) * 100;

        }


        const maxima =
            Math.max(...precos);

        const minima =
            Math.min(...precos);


        // ==========================================
        // ELEMENTOS DO RESUMO
        // ==========================================

        const elementoVariacao =
            document.getElementById(
                "bitcoinPeriodoVariacao"
            );

        const elementoMaxima =
            document.getElementById(
                "bitcoinPeriodoMaxima"
            );

        const elementoMinima =
            document.getElementById(
                "bitcoinPeriodoMinima"
            );


        // ==========================================
        // VARIAÇÃO
        // ==========================================

        if (elementoVariacao) {

            const seta =
                variacaoPeriodo >= 0
                    ? "▲"
                    : "▼";


            elementoVariacao.textContent =
                `${seta} ${Math.abs(
                    variacaoPeriodo
                ).toFixed(2)}%`;


            elementoVariacao.style.color =
                variacaoPeriodo >= 0
                    ? "#16c45b"
                    : "#ff4d4d";

        }


        // ==========================================
        // MÁXIMA
        // ==========================================

        if (elementoMaxima) {

            elementoMaxima.textContent =
                maxima.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0
                    }
                );

        }


        // ==========================================
        // MÍNIMA
        // ==========================================

        if (elementoMinima) {

            elementoMinima.textContent =
                minima.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0
                    }
                );

        }


        // ==========================================
        // LOCALIZAR CANVAS
        // ==========================================

        const canvas =
            document.getElementById(
                "graficoBitcoin"
            );


        if (!canvas) {

            console.error(
                "Canvas #graficoBitcoin não encontrado."
            );

            return;

        }


        // ==========================================
        // VERIFICAR CHART.JS
        // ==========================================

        if (typeof Chart === "undefined") {

            console.error(
                "Chart.js não foi carregado."
            );

            return;

        }


        // ==========================================
        // DESTRUIR GRÁFICO ANTERIOR
        // ==========================================

        if (graficoBitcoin) {

            graficoBitcoin.destroy();

            graficoBitcoin = null;

        }


        // ==========================================
        // CRIAR GRÁFICO
        // ==========================================

        graficoBitcoin =
            new Chart(canvas, {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label: "Bitcoin",

                            data: precos,

                            borderColor:
                                "#16c45b",

                            backgroundColor:
                                "rgba(22,196,91,0.10)",

                            borderWidth: 3,

                            tension: 0.25,

                            pointRadius: 0,

                            pointHoverRadius: 5,

                            pointHitRadius: 10,

                            fill: true

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    // ==================================
                    // INTERAÇÃO
                    // ==================================

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    // ==================================
                    // PLUGINS
                    // ==================================

                    plugins: {

                        legend: {

                            display: false

                        },


                        tooltip: {

                            displayColors: false,

                            callbacks: {

                                label: function(context) {

                                    const valor =
                                        Number(context.raw);

                                    return (
                                        "Bitcoin: " +
                                        valor.toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                                maximumFractionDigits: 0
                                            }
                                        )
                                    );

                                }

                            }

                        }

                    },


                    // ==================================
                    // ESCALAS
                    // ==================================

                    scales: {

                        x: {

                            grid: {

                                display: false

                            },

                            ticks: {

                                maxTicksLimit: 8,

                                maxRotation: 0,

                                autoSkip: true

                            }

                        },


                        y: {

                            beginAtZero: false,

                            grid: {

                                color:
                                    "rgba(0,0,0,0.05)"

                            },

                            ticks: {

                                callback: function(valor) {

                                    return Number(valor)
                                        .toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                                maximumFractionDigits: 0
                                            }
                                        );

                                }

                            }

                        }

                    }

                }

            });


        console.log(
            "✅ Gráfico do Bitcoin atualizado!"
        );


    } catch (erro) {

        console.error(
            "❌ Erro no gráfico do Bitcoin:",
            erro
        );

    }

}


// ==========================================
// BOTÕES DE PERÍODO
// ==========================================

function configurarBotoesBitcoin() {

    const botoes =
        document.querySelectorAll(
            ".bitcoin-periodos button"
        );


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            function() {

                botoes.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                const periodo =
                    this.dataset.periodo;


                carregarGraficoBitcoin(
                    periodo
                );

            }
        );

    });

}


// ==========================================
// INICIAR
// ==========================================

console.log(
    "₿ Arquivo bitcoin-chart.js carregado!"
);

configurarBotoesBitcoin();

carregarGraficoBitcoin("1mo");