// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// GRÁFICO SELIC X IPCA
// ==========================================

let graficoSelicIpca = null;


// ==========================================
// FORMATAR REFERÊNCIA
// 2026-07 -> 07/26
// ==========================================

function formatarReferenciaSelicIpca(referencia) {

    if (!referencia) {
        return "";
    }

    const partes =
        referencia.split("-");

    if (partes.length !== 2) {
        return referencia;
    }

    const ano =
        partes[0].slice(-2);

    const mes =
        partes[1];

    return `${mes}/${ano}`;
}


// ==========================================
// FORMATAR PERCENTUAL
// ==========================================

function formatarPercentualSelicIpca(valor) {

    const numero =
        Number(valor);

    if (!Number.isFinite(numero)) {
        return "--";
    }

    return (
        numero
            .toFixed(2)
            .replace(".", ",")
        + "%"
    );
}


// ==========================================
// CARREGAR GRÁFICO
// ==========================================

async function carregarGraficoSelicIpca(
    periodo = "1y"
) {

    try {

        console.log(
            "📊 Carregando Selic x IPCA:",
            periodo
        );


        // ==========================================
        // API
        // ==========================================

        const resposta =
            await fetch(
                `/api/indicadores/historico?periodo=${periodo}`
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "📊 Histórico Selic x IPCA recebido:",
            dados
        );


        // ==========================================
        // VALIDAR PONTOS
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
        // FILTRAR PONTOS VÁLIDOS
        // ==========================================

        const pontosValidos =
            dados.pontos.filter(
                ponto => {

                    const selic =
                        Number(
                            ponto.selic
                        );

                    const ipca =
                        Number(
                            ponto.ipca12
                        );

                    return (
                        Number.isFinite(selic) &&
                        Number.isFinite(ipca)
                    );

                }
            );


        if (
            pontosValidos.length === 0
        ) {

            throw new Error(
                "Nenhum ponto válido encontrado."
            );

        }


        // ==========================================
        // LABELS
        // ==========================================

        const labels =
            pontosValidos.map(
                ponto =>
                    formatarReferenciaSelicIpca(
                        ponto.referencia
                    )
            );


        // ==========================================
        // SELIC
        // ==========================================

        const valoresSelic =
            pontosValidos.map(
                ponto =>
                    Number(
                        ponto.selic
                    )
            );


        // ==========================================
        // IPCA
        // ==========================================

        const valoresIpca =
            pontosValidos.map(
                ponto =>
                    Number(
                        ponto.ipca12
                    )
            );


        // ==========================================
        // ÚLTIMO PONTO
        // ==========================================

        const ultimoPonto =
            pontosValidos[
                pontosValidos.length - 1
            ];


        const selicAtual =
            Number(
                ultimoPonto.selic
            );


        const ipcaAtual =
            Number(
                ultimoPonto.ipca12
            );


        // ==========================================
        // JURO REAL
        // ==========================================

        let juroReal =
            Number(
                ultimoPonto.juroReal
            );


        /*
        Caso algum dia o backend não envie
        juroReal, calculamos no frontend.
        */

        if (
            !Number.isFinite(juroReal) &&
            Number.isFinite(selicAtual) &&
            Number.isFinite(ipcaAtual)
        ) {

            juroReal =
                (
                    (
                        1 +
                        selicAtual / 100
                    )
                    /
                    (
                        1 +
                        ipcaAtual / 100
                    )
                    -
                    1
                ) * 100;

        }


        // ==========================================
        // ATUALIZAR RESUMO
        // ==========================================

        const elementoSelic =
            document.getElementById(
                "selicIpcaSelicAtual"
            );


        const elementoIpca =
            document.getElementById(
                "selicIpcaIpcaAtual"
            );


        const elementoJuroReal =
            document.getElementById(
                "selicIpcaJuroReal"
            );


        if (elementoSelic) {

            elementoSelic.textContent =
                formatarPercentualSelicIpca(
                    selicAtual
                );

        }


        if (elementoIpca) {

            elementoIpca.textContent =
                formatarPercentualSelicIpca(
                    ipcaAtual
                );

        }


        if (elementoJuroReal) {

            elementoJuroReal.textContent =
                formatarPercentualSelicIpca(
                    juroReal
                );


            elementoJuroReal.style.color =
                juroReal >= 0
                    ? "#16c45b"
                    : "#ff4d4d";

        }


        // ==========================================
        // CANVAS
        // ==========================================

        const canvas =
            document.getElementById(
                "graficoSelicIpca"
            );


        if (!canvas) {

            console.warn(
                "⚠️ Canvas graficoSelicIpca não encontrado."
            );

            return;

        }


        // ==========================================
        // DESTRUIR GRÁFICO ANTERIOR
        // ==========================================

        if (graficoSelicIpca) {

            graficoSelicIpca.destroy();

            graficoSelicIpca =
                null;

        }


        // ==========================================
        // CRIAR GRÁFICO
        // ==========================================

        graficoSelicIpca =
            new Chart(
                canvas,
                {

                    type: "line",


                    data: {

                        labels:
                            labels,


                        datasets: [

                            // ==================================
                            // SELIC
                            // ==================================

                            {

                                label:
                                    "Selic",

                                data:
                                    valoresSelic,

                                borderColor:
                                    "#16c45b",

                                backgroundColor:
                                    "rgba(22,196,91,0.08)",

                                borderWidth:
                                    3,

                                tension:
                                    0.25,

                                pointRadius:
                                    3,

                                pointHoverRadius:
                                    6,

                                fill:
                                    false

                            },


                            // ==================================
                            // IPCA
                            // ==================================

                            {

                                label:
                                    "IPCA 12M",

                                data:
                                    valoresIpca,

                                borderColor:
                                    "#f0ad4e",

                                backgroundColor:
                                    "rgba(240,173,78,0.08)",

                                borderWidth:
                                    3,

                                tension:
                                    0.25,

                                pointRadius:
                                    3,

                                pointHoverRadius:
                                    6,

                                fill:
                                    false

                            }

                        ]

                    },


                    // ==========================================
                    // OPÇÕES
                    // ==========================================

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"

                        },


                        plugins: {

                            // ==================================
                            // LEGENDA NATIVA
                            // ==================================

                            legend: {

                                display:
                                    false

                            },


                            // ==================================
                            // TOOLTIP
                            // ==================================

                            tooltip: {

                                displayColors:
                                    true,


                                callbacks: {

                                    label:
                                        function(context) {

                                            const valor =
                                                Number(
                                                    context.raw
                                                );


                                            return (
                                                context.dataset.label +
                                                ": " +
                                                valor
                                                    .toFixed(2)
                                                    .replace(
                                                        ".",
                                                        ","
                                                    ) +
                                                "%"
                                            );

                                        }

                                }

                            }

                        },


                        // ======================================
                        // ESCALAS
                        // ======================================

                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false

                                },


                                ticks: {

                                    maxTicksLimit:
                                        periodo === "5y"
                                            ? 10
                                            : 12,

                                    maxRotation:
                                        0

                                }

                            },


                            y: {

                                beginAtZero:
                                    false,


                                ticks: {

                                    callback:
                                        function(valor) {

                                            return (
                                                Number(valor)
                                                    .toFixed(1)
                                                    .replace(
                                                        ".",
                                                        ","
                                                    )
                                                +
                                                "%"
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );


        console.log(
            "✅ Gráfico Selic x IPCA atualizado!"
        );


    } catch (erro) {

        console.error(
            "❌ Erro no gráfico Selic x IPCA:",
            erro
        );

    }

}


// ==========================================
// BOTÕES DE PERÍODO
// ==========================================

function configurarBotoesSelicIpca() {

    const botoes =
        document.querySelectorAll(
            ".selic-ipca-periodos button"
        );


    botoes.forEach(
        botao => {

            botao.addEventListener(
                "click",
                function() {

                    // ==================================
                    // REMOVER ACTIVE
                    // ==================================

                    botoes.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    // ==================================
                    // ADICIONAR ACTIVE
                    // ==================================

                    this.classList.add(
                        "active"
                    );


                    // ==================================
                    // NOVO PERÍODO
                    // ==================================

                    const periodo =
                        this.dataset.periodo;


                    carregarGraficoSelicIpca(
                        periodo
                    );

                }
            );

        }
    );

}


// ==========================================
// INICIAR
// ==========================================

console.log(
    "📊 Arquivo selic-ipca-chart.js carregado!"
);


document.addEventListener(
    "DOMContentLoaded",
    function() {

        configurarBotoesSelicIpca();

        carregarGraficoSelicIpca(
            "1y"
        );

    }
);