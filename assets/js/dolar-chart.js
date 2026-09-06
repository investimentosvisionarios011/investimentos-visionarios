// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// GRÁFICO HISTÓRICO DO DÓLAR
// ==========================================

let graficoDolar = null;


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarDataDolar(timestamp, periodo) {

    const data =
        new Date(timestamp);


    if (periodo === "5d") {

        return data.toLocaleString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    return data.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit"
        }
    );

}


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarValorDolar(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// CARREGAR GRÁFICO
// ==========================================

async function carregarGraficoDolar(
    periodo = "1mo"
) {

    console.log(
        `💵 Carregando histórico do Dólar: ${periodo}`
    );


    try {

        // ==========================================
        // BUSCAR API
        // ==========================================

        const resposta =
            await fetch(
                `/api/dolar/historico?periodo=${encodeURIComponent(periodo)}`
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "💵 Histórico do Dólar recebido:",
            dados
        );


        // ==========================================
        // VALIDAR RESPOSTA
        // ==========================================

        if (
            !dados.pontos ||
            !Array.isArray(dados.pontos) ||
            dados.pontos.length === 0
        ) {

            throw new Error(
                "Nenhum dado histórico do Dólar encontrado."
            );

        }


        // ==========================================
        // REMOVER PONTOS INVÁLIDOS
        // ==========================================

        const pontosValidos =
            dados.pontos.filter(ponto => {

                const preco =
                    Number(ponto.preco);

                const data =
                    Number(ponto.data);


                return (
                    Number.isFinite(preco) &&
                    preco > 0 &&
                    Number.isFinite(data)
                );

            });


        if (pontosValidos.length === 0) {

            throw new Error(
                "Nenhum preço válido encontrado para o Dólar."
            );

        }


        // ==========================================
        // LABELS
        // ==========================================

        const labels =
            pontosValidos.map(ponto => {

                return formatarDataDolar(
                    ponto.data,
                    periodo
                );

            });


        // ==========================================
        // PREÇOS
        // ==========================================

        const precos =
            pontosValidos.map(ponto => {

                return Number(
                    ponto.preco
                );

            });


        // ==========================================
        // RESUMO DO PERÍODO
        // ==========================================

        const primeiroValor =
            precos[0];

        const ultimoValor =
            precos[
                precos.length - 1
            ];


        let variacaoPeriodo = 0;


        if (
            Number.isFinite(primeiroValor) &&
            Number.isFinite(ultimoValor) &&
            primeiroValor !== 0
        ) {

            variacaoPeriodo =
                (
                    (
                        ultimoValor -
                        primeiroValor
                    )
                    /
                    primeiroValor
                ) * 100;

        }


        const maxima =
            Math.max(...precos);

        const minima =
            Math.min(...precos);


        console.log(
            "💵 Resumo Dólar:",
            {
                primeiroValor,
                ultimoValor,
                variacaoPeriodo,
                maxima,
                minima
            }
        );


        // ==========================================
        // ELEMENTOS
        // ==========================================

        const elementoVariacao =
            document.getElementById(
                "dolarPeriodoVariacao"
            );

        const elementoMaxima =
            document.getElementById(
                "dolarPeriodoMaxima"
            );

        const elementoMinima =
            document.getElementById(
                "dolarPeriodoMinima"
            );


        // ==========================================
        // VARIAÇÃO
        // ==========================================

        if (elementoVariacao) {

            const positivo =
                variacaoPeriodo >= 0;

            const seta =
                positivo
                    ? "▲"
                    : "▼";


            elementoVariacao.textContent =
                `${seta} ${Math.abs(
                    variacaoPeriodo
                ).toFixed(2)}%`;


            elementoVariacao.style.color =
                positivo
                    ? "#16c45b"
                    : "#ff4d4d";

        }


        // ==========================================
        // MÁXIMA
        // ==========================================

        if (elementoMaxima) {

            elementoMaxima.textContent =
                formatarValorDolar(
                    maxima
                );

        }


        // ==========================================
        // MÍNIMA
        // ==========================================

        if (elementoMinima) {

            elementoMinima.textContent =
                formatarValorDolar(
                    minima
                );

        }


        // ==========================================
        // LOCALIZAR CANVAS
        // ==========================================

        const canvas =
            document.getElementById(
                "graficoDolar"
            );


        if (!canvas) {

            console.error(
                "❌ Canvas #graficoDolar não encontrado."
            );

            return;

        }


        // ==========================================
        // VERIFICAR CHART.JS
        // ==========================================

        if (typeof Chart === "undefined") {

            console.error(
                "❌ Chart.js não foi carregado."
            );

            return;

        }


        // ==========================================
        // DESTRUIR GRÁFICO ANTERIOR
        // ==========================================

        if (graficoDolar) {

            graficoDolar.destroy();

            graficoDolar = null;

        }


        // ==========================================
        // CRIAR GRÁFICO
        // ==========================================

        graficoDolar =
            new Chart(
                canvas,
                {

                    type:
                        "line",

                    data: {

                        labels:
                            labels,

                        datasets: [

                            {

                                label:
                                    "Dólar",

                                data:
                                    precos,

                                borderColor:
                                    "#16c45b",

                                backgroundColor:
                                    "rgba(22,196,91,0.10)",

                                borderWidth:
                                    3,

                                tension:
                                    0.25,

                                pointRadius:
                                    0,

                                pointHoverRadius:
                                    5,

                                pointHitRadius:
                                    10,

                                fill:
                                    true

                            }

                        ]

                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        // ==================================
                        // INTERAÇÃO
                        // ==================================

                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"

                        },


                        // ==================================
                        // PLUGINS
                        // ==================================

                        plugins: {

                            legend: {

                                display:
                                    false

                            },


                            tooltip: {

                                displayColors:
                                    false,

                                callbacks: {

                                    label:
                                        function(context) {

                                            return (
                                                "Dólar: " +
                                                formatarValorDolar(
                                                    context.raw
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

                                    display:
                                        false

                                },

                                ticks: {

                                    maxTicksLimit:
                                        8,

                                    maxRotation:
                                        0,

                                    autoSkip:
                                        true

                                }

                            },


                            y: {

                                beginAtZero:
                                    false,

                                grid: {

                                    color:
                                        "rgba(0,0,0,0.05)"

                                },

                                ticks: {

                                    callback:
                                        function(valor) {

                                            return formatarValorDolar(
                                                valor
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );


        console.log(
            "✅ Gráfico do Dólar atualizado!"
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar gráfico do Dólar:",
            erro
        );

    }

}


// ==========================================
// CONFIGURAR BOTÕES
// ==========================================

function configurarBotoesDolar() {

    const botoes =
        document.querySelectorAll(
            ".dolar-periodos button"
        );


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            function() {

                botoes.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                const periodo =
                    this.dataset.periodo;


                console.log(
                    "📅 Período do Dólar:",
                    periodo
                );


                carregarGraficoDolar(
                    periodo
                );

            }
        );

    });

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "💵 Inicializando gráfico do Dólar..."
        );


        configurarBotoesDolar();


        carregarGraficoDolar(
            "1mo"
        );

    }
);