// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// GRÁFICO HISTÓRICO DO IBOVESPA
// ==========================================

let graficoIbovespa = null;


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarDataIbovespa(timestamp, periodo) {

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
// FORMATAR PONTOS
// ==========================================

function formatarPontosIbovespa(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ) + " pts";

}


// ==========================================
// CARREGAR GRÁFICO
// ==========================================

async function carregarGraficoIbovespa(periodo = "1mo") {

    console.log(
        `📈 Carregando histórico do Ibovespa: ${periodo}`
    );

    try {

        // ==========================================
        // BUSCAR API
        // ==========================================

        const resposta = await fetch(
            `/api/ibovespa/historico?periodo=${encodeURIComponent(periodo)}`
        );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados = await resposta.json();


        console.log(
            "📊 Histórico do Ibovespa recebido:",
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
                "Nenhum dado histórico do Ibovespa encontrado."
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
                "Nenhum preço válido encontrado para o Ibovespa."
            );

        }


        // ==========================================
        // LABELS
        // ==========================================

        const labels =
            pontosValidos.map(ponto => {

                return formatarDataIbovespa(
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
            "📈 Resumo Ibovespa:",
            {
                primeiroValor,
                ultimoValor,
                variacaoPeriodo,
                maxima,
                minima
            }
        );


        // ==========================================
        // ELEMENTOS DO RESUMO
        // ==========================================

        const elementoVariacao =
            document.getElementById(
                "ibovespaPeriodoVariacao"
            );

        const elementoMaxima =
            document.getElementById(
                "ibovespaPeriodoMaxima"
            );

        const elementoMinima =
            document.getElementById(
                "ibovespaPeriodoMinima"
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
                formatarPontosIbovespa(
                    maxima
                );

        }


        // ==========================================
        // MÍNIMA
        // ==========================================

        if (elementoMinima) {

            elementoMinima.textContent =
                formatarPontosIbovespa(
                    minima
                );

        }


        // ==========================================
        // LOCALIZAR CANVAS
        // ==========================================

        const canvas =
            document.getElementById(
                "graficoIbovespa"
            );


        if (!canvas) {

            console.error(
                "❌ Canvas #graficoIbovespa não encontrado."
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

        if (graficoIbovespa) {

            graficoIbovespa.destroy();

            graficoIbovespa = null;

        }


        // ==========================================
        // CRIAR GRÁFICO
        // ==========================================

        graficoIbovespa =
            new Chart(
                canvas,
                {

                    type: "line",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Ibovespa",

                                data:
                                    precos,

                                borderColor:
                                    "#16c45b",

                                backgroundColor:
                                    "rgba(22, 196, 91, 0.10)",

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
                                                "Ibovespa: " +
                                                formatarPontosIbovespa(
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

                                            return Number(
                                                valor
                                            ).toLocaleString(
                                                "pt-BR",
                                                {
                                                    maximumFractionDigits: 0
                                                }
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );


        console.log(
            "✅ Gráfico do Ibovespa atualizado!"
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar gráfico do Ibovespa:",
            erro
        );

    }

}


// ==========================================
// CONFIGURAR BOTÕES
// ==========================================

function configurarBotoesIbovespa() {

    const botoes =
        document.querySelectorAll(
            ".ibovespa-periodos button"
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
                    "📅 Período do Ibovespa:",
                    periodo
                );


                carregarGraficoIbovespa(
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
            "📊 Inicializando gráfico do Ibovespa..."
        );


        configurarBotoesIbovespa();


        carregarGraficoIbovespa(
            "1mo"
        );

    }
);