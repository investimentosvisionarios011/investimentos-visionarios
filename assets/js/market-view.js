// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// VISÃO DO MERCADO
// ==========================================

let periodoVisaoMercado = "1mo";


// ==========================================
// CALCULAR VARIAÇÃO
// ==========================================

function calcularVariacaoMercado(pontos) {

    if (
        !Array.isArray(pontos) ||
        pontos.length < 2
    ) {

        return null;

    }

    const precosValidos =
        pontos
            .map(
                ponto =>
                    Number(ponto.preco)
            )
            .filter(
                preco =>
                    Number.isFinite(preco) &&
                    preco > 0
            );


    if (precosValidos.length < 2) {

        return null;

    }


    const primeiroValor =
        precosValidos[0];


    const ultimoValor =
        precosValidos[
            precosValidos.length - 1
        ];


    if (
        !Number.isFinite(primeiroValor) ||
        !Number.isFinite(ultimoValor) ||
        primeiroValor === 0
    ) {

        return null;

    }


    return (
        (
            ultimoValor -
            primeiroValor
        )
        /
        primeiroValor
    ) * 100;

}


// ==========================================
// FORMATAR PERÍODO
// ==========================================

function obterNomePeriodoMercado(periodo) {

    const nomes = {

        "1mo":
            "Último mês",

        "6mo":
            "Últimos 6 meses",

        "1y":
            "Último ano"

    };


    return nomes[periodo] ||
        "Período selecionado";

}


// ==========================================
// CARREGAR VISÃO DO MERCADO
// ==========================================

async function carregarVisaoMercado(
    periodo = "1mo"
) {

    console.log(
        `👁️ Carregando Visão do Mercado: ${periodo}`
    );


    try {

        // ==========================================
        // BUSCAR DADOS
        // ==========================================

        const [
            respostaIbovespa,
            respostaDolar,
            respostaBitcoin
        ] = await Promise.all([

            fetch(
                `/api/ibovespa/historico?periodo=${periodo}`
            ),

            fetch(
                `/api/dolar/historico?periodo=${periodo}`
            ),

            fetch(
                `/api/bitcoin/historico?periodo=${periodo}`
            )

        ]);


        // ==========================================
        // VALIDAR RESPOSTAS
        // ==========================================

        if (!respostaIbovespa.ok) {

            throw new Error(
                `Erro no Ibovespa: HTTP ${respostaIbovespa.status}`
            );

        }


        if (!respostaDolar.ok) {

            throw new Error(
                `Erro no Dólar: HTTP ${respostaDolar.status}`
            );

        }


        if (!respostaBitcoin.ok) {

            throw new Error(
                `Erro no Bitcoin: HTTP ${respostaBitcoin.status}`
            );

        }


        // ==========================================
        // JSON
        // ==========================================

        const [
            dadosIbovespa,
            dadosDolar,
            dadosBitcoin
        ] = await Promise.all([

            respostaIbovespa.json(),

            respostaDolar.json(),

            respostaBitcoin.json()

        ]);


        // ==========================================
        // ATIVOS
        // ==========================================

        const ativos = [

            {

                nome:
                    "Ibovespa",

                variacao:
                    calcularVariacaoMercado(
                        dadosIbovespa.pontos
                    )

            },

            {

                nome:
                    "Dólar",

                variacao:
                    calcularVariacaoMercado(
                        dadosDolar.pontos
                    )

            },

            {

                nome:
                    "Bitcoin",

                variacao:
                    calcularVariacaoMercado(
                        dadosBitcoin.pontos
                    )

            }

        ].filter(

            ativo =>
                Number.isFinite(
                    ativo.variacao
                )

        );


        if (ativos.length === 0) {

            throw new Error(
                "Nenhum ativo válido para comparação."
            );

        }


        // ==========================================
        // ORDENAR
        // ==========================================

        ativos.sort(
            (a, b) =>
                b.variacao -
                a.variacao
        );


        const melhor =
            ativos[0];


        const pior =
            ativos[
                ativos.length - 1
            ];


        // ==========================================
        // ELEMENTOS
        // ==========================================

        const melhorAtivo =
            document.getElementById(
                "melhorAtivo"
            );


        const melhorVariacao =
            document.getElementById(
                "melhorAtivoVariacao"
            );


        const piorAtivo =
            document.getElementById(
                "piorAtivo"
            );


        const piorVariacao =
            document.getElementById(
                "piorAtivoVariacao"
            );


        const sentimentoMercado =
            document.getElementById(
                "sentimentoMercado"
            );


        const sentimentoDescricao =
            document.getElementById(
                "sentimentoDescricao"
            );


        const rankingLista =
            document.getElementById(
                "marketRankingLista"
            );


        const rankingPeriodo =
            document.getElementById(
                "marketRankingPeriodo"
            );


        // ==========================================
        // MELHOR DESEMPENHO
        // ==========================================

        if (melhorAtivo) {

            melhorAtivo.textContent =
                melhor.nome;

        }


        if (melhorVariacao) {

            const positivo =
                melhor.variacao >= 0;


            melhorVariacao.textContent =
                `${positivo ? "▲" : "▼"} ` +
                `${Math.abs(
                    melhor.variacao
                ).toFixed(2)}%`;


            melhorVariacao.style.color =
                positivo
                    ? "#16c45b"
                    : "#ff4d4d";

        }


        // ==========================================
        // PIOR DESEMPENHO
        // ==========================================

        if (piorAtivo) {

            piorAtivo.textContent =
                pior.nome;

        }


        if (piorVariacao) {

            const positivo =
                pior.variacao >= 0;


            piorVariacao.textContent =
                `${positivo ? "▲" : "▼"} ` +
                `${Math.abs(
                    pior.variacao
                ).toFixed(2)}%`;


            piorVariacao.style.color =
                positivo
                    ? "#16c45b"
                    : "#ff4d4d";

        }


        // ==========================================
        // SENTIMENTO
        // ==========================================

        const positivos =
            ativos.filter(
                ativo =>
                    ativo.variacao > 0
            ).length;


        const negativos =
            ativos.filter(
                ativo =>
                    ativo.variacao < 0
            ).length;


        let sentimentoTexto =
            "Neutro";


        let descricao =
            "Mercado sem direção predominante.";


        let corSentimento =
            "#777";


        if (positivos > negativos) {

            sentimentoTexto =
                "Positivo";


            descricao =
                "Maioria dos ativos analisados está em alta.";


            corSentimento =
                "#16c45b";

        }


        else if (negativos > positivos) {

            sentimentoTexto =
                "Negativo";


            descricao =
                "Maioria dos ativos analisados está em queda.";


            corSentimento =
                "#ff4d4d";

        }


        else {

            sentimentoTexto =
                "Misto";


            descricao =
                "Os ativos analisados apresentam sinais divididos.";


            corSentimento =
                "#d4a017";

        }


        if (sentimentoMercado) {

            sentimentoMercado.textContent =
                sentimentoTexto;


            sentimentoMercado.style.color =
                corSentimento;

        }


        if (sentimentoDescricao) {

            sentimentoDescricao.textContent =
                descricao;

        }


        // ==========================================
        // PERÍODO DO RANKING
        // ==========================================

        if (rankingPeriodo) {

            rankingPeriodo.textContent =
                obterNomePeriodoMercado(
                    periodo
                );

        }


        // ==========================================
        // RANKING
        // ==========================================

        if (rankingLista) {

            rankingLista.innerHTML =
                "";


            const maiorValorAbsoluto =
                Math.max(
                    ...ativos.map(
                        ativo =>
                            Math.abs(
                                ativo.variacao
                            )
                    ),
                    1
                );


            ativos.forEach(
                (
                    ativo,
                    indice
                ) => {


                    const positivo =
                        ativo.variacao >= 0;


                    const seta =
                        positivo
                            ? "▲"
                            : "▼";


                    const cor =
                        positivo
                            ? "#16c45b"
                            : "#ff4d4d";


                    const largura =
                        Math.max(
                            8,
                            (
                                Math.abs(
                                    ativo.variacao
                                )
                                /
                                maiorValorAbsoluto
                            ) * 100
                        );


                    const linha =
                        document.createElement(
                            "div"
                        );


                    linha.className =
                        "market-ranking-row";


                    linha.innerHTML = `

                        <div class="market-ranking-position">
                            ${indice + 1}º
                        </div>

                        <div class="market-ranking-info">

                            <div class="market-ranking-name">

                                <span>
                                    ${ativo.nome}
                                </span>

                                <strong
                                    style="color:${cor}"
                                >
                                    ${seta}
                                    ${Math.abs(
                                        ativo.variacao
                                    ).toFixed(2)}%
                                </strong>

                            </div>

                            <div class="market-ranking-bar">

                                <div
                                    class="market-ranking-progress"
                                    style="
                                        width:${largura}%;
                                        background:${cor};
                                    "
                                ></div>

                            </div>

                        </div>

                    `;


                    rankingLista.appendChild(
                        linha
                    );

                }
            );

        }


        console.log(
            "✅ Visão do Mercado atualizada:",
            {
                periodo,
                ativos
            }
        );


    } catch (erro) {

        console.error(
            "❌ Erro na Visão do Mercado:",
            erro
        );

    }

}


// ==========================================
// CONFIGURAR BOTÕES
// ==========================================

function configurarPeriodosVisaoMercado() {

    const botoes =
        document.querySelectorAll(
            ".market-view-periodos button"
        );


    botoes.forEach(
        botao => {

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


                    periodoVisaoMercado =
                        this.dataset.periodo;


                    carregarVisaoMercado(
                        periodoVisaoMercado
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
    "👁️ Arquivo market-view.js carregado!"
);


document.addEventListener(
    "DOMContentLoaded",
    function() {

        configurarPeriodosVisaoMercado();


        carregarVisaoMercado(
            periodoVisaoMercado
        );

    }
);