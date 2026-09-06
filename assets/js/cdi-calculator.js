// ==========================================
// CALCULADORA CDI
// Investimentos Visionários
// ==========================================

let taxaCDIAtual = 0;


// ==========================================
// FORMATAÇÃO
// ==========================================

function formatarMoedaCDI(valor) {

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
// BUSCAR CDI ATUAL
// ==========================================

async function carregarTaxaCDI() {

    const elementoTaxa =
        document.getElementById(
            "cdiTaxaAtualCalculadora"
        );


    try {

        console.log(
            "🏦 Buscando CDI atual..."
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


        // ==========================================
        // CDI ANUAL VINDO DO BACKEND
        // ==========================================

        const cdi =
            Number(
                dados?.cdi?.valorAnual
            );


        if (
            !Number.isFinite(cdi) ||
            cdi <= 0
        ) {

            throw new Error(
                "Taxa CDI inválida recebida da API."
            );

        }


        taxaCDIAtual =
            cdi;


        if (elementoTaxa) {

            elementoTaxa.textContent =
                taxaCDIAtual
                    .toFixed(2)
                    .replace(".", ",")
                + "%";

        }


        console.log(
            `✅ CDI atual: ${taxaCDIAtual}% a.a.`
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar CDI:",
            erro
        );


        if (elementoTaxa) {

            elementoTaxa.textContent =
                "Indisponível";

        }

    }

}


// ==========================================
// ALÍQUOTA REGRESSIVA DO IR
// ==========================================

function obterAliquotaIR(meses) {

    /*
        Aproximação da tabela regressiva:

        Até 6 meses       = 22,5%
        Até 12 meses      = 20%
        Até 24 meses      = 17,5%
        Acima de 24 meses = 15%
    */


    if (meses <= 6) {

        return 22.5;

    }


    if (meses <= 12) {

        return 20;

    }


    if (meses <= 24) {

        return 17.5;

    }


    return 15;

}


// ==========================================
// CONVERTER TAXA ANUAL PARA MENSAL
// ==========================================

function converterTaxaAnualParaMensal(
    taxaAnual
) {

    return (
        Math.pow(
            1 + taxaAnual / 100,
            1 / 12
        ) - 1
    );

}


// ==========================================
// CALCULAR CDI
// ==========================================

function calcularCDI() {

    // ==========================================
    // CAMPOS
    // ==========================================

    const valorInicial =
        Number(
            document.getElementById(
                "cdiValorInicial"
            )?.value
        ) || 0;


    const aporteMensal =
        Number(
            document.getElementById(
                "cdiAporteMensal"
            )?.value
        ) || 0;


    const percentualCDI =
        Number(
            document.getElementById(
                "cdiPercentual"
            )?.value
        );


    const meses =
        Number(
            document.getElementById(
                "cdiMeses"
            )?.value
        );


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        !Number.isFinite(taxaCDIAtual) ||
        taxaCDIAtual <= 0
    ) {

        alert(
            "A taxa CDI ainda não foi carregada."
        );

        return;

    }


    if (
        valorInicial <= 0 &&
        aporteMensal <= 0
    ) {

        alert(
            "Informe um valor inicial ou um aporte mensal."
        );

        return;

    }


    if (
        !Number.isFinite(percentualCDI) ||
        percentualCDI <= 0
    ) {

        alert(
            "Informe um percentual válido do CDI."
        );

        return;

    }


    if (
        !Number.isInteger(meses) ||
        meses <= 0
    ) {

        alert(
            "Informe um prazo válido em meses."
        );

        return;

    }


    // ==========================================
    // TAXA DO INVESTIMENTO
    // ==========================================

    const taxaInvestimentoAnual =
        taxaCDIAtual *
        (
            percentualCDI / 100
        );


    const taxaMensal =
        converterTaxaAnualParaMensal(
            taxaInvestimentoAnual
        );


    console.log(
        "📊 Simulação CDI:",
        {
            taxaCDIAtual,
            percentualCDI,
            taxaInvestimentoAnual,
            taxaMensal,
            meses
        }
    );


    // ==========================================
    // SIMULAÇÃO MÊS A MÊS
    // ==========================================

    let patrimonio =
        valorInicial;


    for (
        let mes = 1;
        mes <= meses;
        mes++
    ) {

        patrimonio *=
            (
                1 +
                taxaMensal
            );


        patrimonio +=
            aporteMensal;

    }


    // ==========================================
    // TOTAL INVESTIDO
    // ==========================================

    const totalInvestido =
        valorInicial +
        (
            aporteMensal *
            meses
        );


    // ==========================================
    // RENDIMENTO BRUTO
    // ==========================================

    const rendimentoBruto =
        Math.max(
            patrimonio -
            totalInvestido,
            0
        );


    // ==========================================
    // IMPOSTO DE RENDA
    // ==========================================

    const aliquotaIR =
        obterAliquotaIR(
            meses
        );


    const impostoRenda =
        rendimentoBruto *
        (
            aliquotaIR / 100
        );


    // ==========================================
    // RENDIMENTO LÍQUIDO
    // ==========================================

    const rendimentoLiquido =
        rendimentoBruto -
        impostoRenda;


    // ==========================================
    // PATRIMÔNIO FINAL
    // ==========================================

    const patrimonioFinal =
        totalInvestido +
        rendimentoLiquido;


    // ==========================================
    // EXIBIR RESULTADOS
    // ==========================================

    atualizarResultadoCDI(
        "cdiTotalInvestido",
        formatarMoedaCDI(
            totalInvestido
        )
    );


    atualizarResultadoCDI(
        "cdiRendimentoBruto",
        formatarMoedaCDI(
            rendimentoBruto
        )
    );


    atualizarResultadoCDI(
        "cdiImpostoRenda",
        formatarMoedaCDI(
            impostoRenda
        )
    );


    atualizarResultadoCDI(
        "cdiAliquotaIr",
        aliquotaIR
            .toFixed(1)
            .replace(".", ",")
        + "%"
    );


    atualizarResultadoCDI(
        "cdiRendimentoLiquido",
        formatarMoedaCDI(
            rendimentoLiquido
        )
    );


    atualizarResultadoCDI(
        "cdiPatrimonioFinal",
        formatarMoedaCDI(
            patrimonioFinal
        )
    );


    console.log(
        "✅ Simulação CDI concluída!",
        {
            totalInvestido,
            rendimentoBruto,
            impostoRenda,
            rendimentoLiquido,
            patrimonioFinal
        }
    );

}


// ==========================================
// ATUALIZAR RESULTADO
// ==========================================

function atualizarResultadoCDI(
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
// LIMPAR CALCULADORA
// ==========================================

function limparCDI() {

    const valorInicial =
        document.getElementById(
            "cdiValorInicial"
        );


    const aporteMensal =
        document.getElementById(
            "cdiAporteMensal"
        );


    const percentualCDI =
        document.getElementById(
            "cdiPercentual"
        );


    const meses =
        document.getElementById(
            "cdiMeses"
        );


    if (valorInicial) {

        valorInicial.value =
            "";

    }


    if (aporteMensal) {

        aporteMensal.value =
            "";

    }


    if (percentualCDI) {

        percentualCDI.value =
            "100";

    }


    if (meses) {

        meses.value =
            "";

    }


    atualizarResultadoCDI(
        "cdiTotalInvestido",
        "R$ 0,00"
    );


    atualizarResultadoCDI(
        "cdiRendimentoBruto",
        "R$ 0,00"
    );


    atualizarResultadoCDI(
        "cdiImpostoRenda",
        "R$ 0,00"
    );


    atualizarResultadoCDI(
        "cdiAliquotaIr",
        "0%"
    );


    atualizarResultadoCDI(
        "cdiRendimentoLiquido",
        "R$ 0,00"
    );


    atualizarResultadoCDI(
        "cdiPatrimonioFinal",
        "R$ 0,00"
    );


    console.log(
        "🧹 Calculadora CDI limpa."
    );

}


// ==========================================
// INICIAR
// ==========================================

console.log(
    "🏦 Arquivo cdi-calculator.js carregado!"
);


document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarTaxaCDI();

    }
);