// ==========================================
// CALCULADORA IPCA
// Investimentos Visionários
// ==========================================

let taxaIPCAAtual = 0;


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaIPCA(valor) {

    return Number(valor).toLocaleString(
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
// CARREGAR IPCA
// ==========================================

async function carregarIPCAAtual() {

    const elemento =
        document.getElementById(
            "ipcaTaxaAtual"
        );


    try {

        console.log(
            "📊 Buscando IPCA atual..."
        );


        const resposta =
            await fetch(
                "/api/indicadores"
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "📊 Indicadores recebidos:",
            dados
        );


     const ipca =
    Number(
        dados?.ipca?.valor12Meses
    );


        if (
            !Number.isFinite(ipca) ||
            ipca <= 0
        ) {

            throw new Error(
                "IPCA inválido recebido da API."
            );

        }


        taxaIPCAAtual =
            ipca;


        if (elemento) {

            elemento.textContent =
                taxaIPCAAtual
                    .toFixed(2)
                    .replace(".", ",")
                + "%";

        }


        console.log(
            `✅ IPCA atual: ${taxaIPCAAtual}%`
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar IPCA:",
            erro
        );


        if (elemento) {

            elemento.textContent =
                "Indisponível";

        }

    }

}


// ==========================================
// CALCULAR
// ==========================================

function calcularIPCA() {

    const valorInicial =
        Number(
            document.getElementById(
                "ipcaValorInicial"
            )?.value
        );


    const rentabilidadeNominal =
        Number(
            document.getElementById(
                "ipcaRentabilidade"
            )?.value
        );


    const anos =
        Number(
            document.getElementById(
                "ipcaAnos"
            )?.value
        );


    if (
        !Number.isFinite(
            taxaIPCAAtual
        ) ||
        taxaIPCAAtual <= 0
    ) {

        alert(
            "O IPCA ainda não foi carregado."
        );

        return;

    }


    if (
        !Number.isFinite(
            valorInicial
        ) ||
        valorInicial <= 0
    ) {

        alert(
            "Informe um valor inicial válido."
        );

        return;

    }


    if (
        !Number.isFinite(
            rentabilidadeNominal
        ) ||
        rentabilidadeNominal < 0
    ) {

        alert(
            "Informe uma rentabilidade válida."
        );

        return;

    }


    if (
        !Number.isInteger(
            anos
        ) ||
        anos <= 0
    ) {

        alert(
            "Informe um prazo válido em anos."
        );

        return;

    }


    // ==========================================
    // VALOR FINAL NOMINAL
    // ==========================================

    const valorFinalNominal =
        valorInicial *
        Math.pow(
            1 +
            rentabilidadeNominal / 100,
            anos
        );


    // ==========================================
    // GANHO NOMINAL
    // ==========================================

    const ganhoNominal =
        valorFinalNominal -
        valorInicial;


    // ==========================================
    // TAXA REAL
    // Fisher:
    // (1 + nominal) / (1 + inflação) - 1
    // ==========================================

    const taxaRealAnual =
        (
            (
                1 +
                rentabilidadeNominal / 100
            )
            /
            (
                1 +
                taxaIPCAAtual / 100
            )
            -
            1
        );


    // ==========================================
    // VALOR REAL FINAL
    // ==========================================

    const inflacaoAcumulada =
        Math.pow(
            1 +
            taxaIPCAAtual / 100,
            anos
        );


    const valorFinalReal =
        valorFinalNominal /
        inflacaoAcumulada;


    // ==========================================
    // RENTABILIDADE REAL ACUMULADA
    // ==========================================

    const rentabilidadeRealAcumulada =
        (
            valorFinalReal /
            valorInicial -
            1
        ) * 100;


    // ==========================================
    // RESULTADOS
    // ==========================================

    atualizarResultadoIPCA(
        "ipcaValorInicialResultado",
        formatarMoedaIPCA(
            valorInicial
        )
    );


    atualizarResultadoIPCA(
        "ipcaValorFinalNominal",
        formatarMoedaIPCA(
            valorFinalNominal
        )
    );


    atualizarResultadoIPCA(
        "ipcaGanhoNominal",
        formatarMoedaIPCA(
            ganhoNominal
        )
    );


    atualizarResultadoIPCA(
        "ipcaRentabilidadeReal",
        rentabilidadeRealAcumulada
            .toFixed(2)
            .replace(".", ",")
        + "%"
    );


    atualizarResultadoIPCA(
        "ipcaValorReal",
        formatarMoedaIPCA(
            valorFinalReal
        )
    );


    console.log(
        "✅ Simulação IPCA:",
        {
            valorInicial,
            rentabilidadeNominal,
            taxaIPCAAtual,
            taxaRealAnual:
                taxaRealAnual * 100,
            anos,
            valorFinalNominal,
            valorFinalReal,
            rentabilidadeRealAcumulada
        }
    );

}


// ==========================================
// ATUALIZAR RESULTADO
// ==========================================

function atualizarResultadoIPCA(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


// ==========================================
// LIMPAR
// ==========================================

function limparIPCA() {

    const campos = [

        "ipcaValorInicial",

        "ipcaRentabilidade",

        "ipcaAnos"

    ];


    campos.forEach(
        id => {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.value =
                    "";

            }

        }
    );


    atualizarResultadoIPCA(
        "ipcaValorInicialResultado",
        "R$ 0,00"
    );


    atualizarResultadoIPCA(
        "ipcaValorFinalNominal",
        "R$ 0,00"
    );


    atualizarResultadoIPCA(
        "ipcaGanhoNominal",
        "R$ 0,00"
    );


    atualizarResultadoIPCA(
        "ipcaRentabilidadeReal",
        "0%"
    );


    atualizarResultadoIPCA(
        "ipcaValorReal",
        "R$ 0,00"
    );

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarIPCAAtual();

    }
);