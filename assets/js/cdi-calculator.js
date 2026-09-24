// ==========================================
// CALCULADORA CDI
// Investimentos Visionários
// ==========================================

let taxaCDIAtual = 0;


// ==========================================
// FORMATAÇÃO DE MOEDA
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
// CONVERTER VALOR MONETÁRIO
// ==========================================

function obterValorNumericoCDI(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    let texto = String(valor);

    // Remove R$ e espaços
    texto = texto
        .replace(/R\$/g, "")
        .replace(/\s/g, "");


    // Converte formato brasileiro
    // 10.000,00 → 10000.00

    texto = texto
        .replace(/\./g, "")
        .replace(",", ".");


    const numero =
        parseFloat(texto);


    return Number.isFinite(numero)
        ? numero
        : 0;

}


// ==========================================
// PREPARAR CAMPOS MONETÁRIOS
// ==========================================

function prepararCamposMonetariosCDI() {

    const campos = [
        "cdiValorInicial",
        "cdiAporteMensal"
    ];


    campos.forEach(function(id) {

        const campo =
            document.getElementById(id);


        if (!campo) {
            return;
        }


        // Permite digitação numérica

        campo.addEventListener(
            "focus",
            function() {

                const valor =
                    obterValorNumericoCDI(
                        this.value
                    );


                this.value =
                    valor > 0
                        ? valor
                        : "";

            }
        );


        // Formata ao sair do campo

        campo.addEventListener(
            "blur",
            function() {

                const valor =
                    obterValorNumericoCDI(
                        this.value
                    );


                if (valor > 0) {

                    this.value =
                        formatarMoedaCDI(
                            valor
                        );

                } else {

                    this.value = "";

                }

            }
        );

    });

}


// ==========================================
// OBTER PRAZO EM MESES
// ==========================================

function obterPrazoEmMesesCDI() {

    const campoPrazo =
        document.getElementById(
            "cdiPrazo"
        );


    const campoUnidade =
        document.getElementById(
            "cdiUnidadePrazo"
        );


    if (!campoPrazo) {

        return 0;

    }


    const prazo =
        Number(
            campoPrazo.value
        );


    if (
        !Number.isFinite(prazo) ||
        prazo <= 0
    ) {

        return 0;

    }


    const unidade =
        campoUnidade
            ? campoUnidade.value
            : "meses";


    if (unidade === "anos") {

        return Math.round(
            prazo * 12
        );

    }


    return Math.round(
        prazo
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


        // ==========================================
        // MOSTRAR CDI NA TELA
        // ==========================================

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
    // VALOR INICIAL
    // ==========================================

    const valorInicial =
        obterValorNumericoCDI(
            document.getElementById(
                "cdiValorInicial"
            )?.value
        );


    // ==========================================
    // APORTE MENSAL
    // ==========================================

    const aporteMensal =
        obterValorNumericoCDI(
            document.getElementById(
                "cdiAporteMensal"
            )?.value
        );


    // ==========================================
    // PERCENTUAL DO CDI
    // ==========================================

    const percentualCDI =
        Number(
            document.getElementById(
                "cdiPercentual"
            )?.value
        );


    // ==========================================
    // PRAZO
    // ==========================================

    const meses =
        obterPrazoEmMesesCDI();


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
            "Informe um prazo válido."
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


    // ==========================================
    // TAXA MENSAL
    // ==========================================

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

        // Rendimento do mês

        patrimonio *=
            (
                1 +
                taxaMensal
            );


        // Aporte mensal

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


    const prazo =
        document.getElementById(
            "cdiPrazo"
        );


    const unidadePrazo =
        document.getElementById(
            "cdiUnidadePrazo"
        );


    // ==========================================
    // LIMPAR VALOR INICIAL
    // ==========================================

    if (valorInicial) {

        valorInicial.value =
            "";

    }


    // ==========================================
    // LIMPAR APORTE
    // ==========================================

    if (aporteMensal) {

        aporteMensal.value =
            "";

    }


    // ==========================================
    // RESTAURAR PERCENTUAL
    // ==========================================

    if (percentualCDI) {

        percentualCDI.value =
            "100";

    }


    // ==========================================
    // LIMPAR PRAZO
    // ==========================================

    if (prazo) {

        prazo.value =
            "";

    }


    // ==========================================
    // RESTAURAR UNIDADE
    // ==========================================

    if (unidadePrazo) {

        unidadePrazo.value =
            "meses";

    }


    // ==========================================
    // RESTAURAR RESULTADOS
    // ==========================================

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
// INICIALIZAÇÃO
// ==========================================

console.log(
    "🏦 Arquivo cdi-calculator.js carregado!"
);


document.addEventListener(
    "DOMContentLoaded",
    function() {

        prepararCamposMonetariosCDI();

        carregarTaxaCDI();

    }
);