// ==========================================
// CALCULADORA SELIC
// Investimentos Visionários
// ==========================================

let selicAtual = 0;


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaSelic(valor) {

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
// CARREGAR SELIC ATUAL
// ==========================================

async function carregarSelicAtual() {

    try {

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


        selicAtual =
            Number(
                dados?.selic?.valor
            );


        if (
            !Number.isFinite(selicAtual) ||
            selicAtual <= 0
        ) {

            throw new Error(
                "Taxa Selic inválida."
            );

        }


        const elemento =
            document.getElementById(
                "selicTaxaAtual"
            );


        if (elemento) {

            elemento.textContent =
                selicAtual
                    .toFixed(2)
                    .replace(".", ",") +
                "% a.a.";

        }


        console.log(
            "✅ Selic carregada:",
            selicAtual
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar Selic:",
            erro
        );


        const elemento =
            document.getElementById(
                "selicTaxaAtual"
            );


        if (elemento) {

            elemento.textContent =
                "Indisponível";

        }

    }

}


// ==========================================
// TAXA ANUAL PARA MENSAL
// ==========================================

function converterSelicMensal(
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
// ALÍQUOTA DE IR
// ==========================================

function obterAliquotaSelic(meses) {

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
// CALCULAR
// ==========================================

function calcularSelic() {

    const valorInicial =
        Number(
            document.getElementById(
                "selicValorInicial"
            )?.value
        ) || 0;


    const aporteMensal =
        Number(
            document.getElementById(
                "selicAporteMensal"
            )?.value
        ) || 0;


    const meses =
        Number(
            document.getElementById(
                "selicMeses"
            )?.value
        );


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        selicAtual <= 0
    ) {

        alert(
            "A taxa Selic ainda não foi carregada."
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
        !Number.isInteger(meses) ||
        meses <= 0
    ) {

        alert(
            "Informe um prazo válido em meses."
        );

        return;

    }


    // ==========================================
    // TAXA MENSAL
    // ==========================================

    const taxaMensal =
        converterSelicMensal(
            selicAtual
        );


    // ==========================================
    // SIMULAÇÃO
    // ==========================================

    let patrimonio =
        valorInicial;


    for (
        let mes = 1;
        mes <= meses;
        mes++
    ) {

        patrimonio *=
            1 + taxaMensal;


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

    const aliquota =
        obterAliquotaSelic(
            meses
        );


    const impostoRenda =
        rendimentoBruto *
        (
            aliquota /
            100
        );


    // ==========================================
    // RESULTADO LÍQUIDO
    // ==========================================

    const rendimentoLiquido =
        rendimentoBruto -
        impostoRenda;


    const patrimonioFinal =
        totalInvestido +
        rendimentoLiquido;


    // ==========================================
    // MÉDIA MENSAL
    // ==========================================

    const mediaMensal =
        meses > 0
            ? rendimentoLiquido / meses
            : 0;


    // ==========================================
    // MOSTRAR RESULTADOS
    // ==========================================

    atualizarSelic(
        "selicTotalInvestido",
        formatarMoedaSelic(
            totalInvestido
        )
    );


    atualizarSelic(
        "selicRendimentoBruto",
        formatarMoedaSelic(
            rendimentoBruto
        )
    );


    atualizarSelic(
        "selicIr",
        formatarMoedaSelic(
            impostoRenda
        )
    );


    atualizarSelic(
        "selicAliquota",
        "Alíquota: " +
        aliquota
            .toFixed(1)
            .replace(".", ",") +
        "%"
    );


    atualizarSelic(
        "selicRendimentoLiquido",
        formatarMoedaSelic(
            rendimentoLiquido
        )
    );


    atualizarSelic(
        "selicPatrimonioFinal",
        formatarMoedaSelic(
            patrimonioFinal
        )
    );


    atualizarSelic(
        "selicMediaMensal",
        formatarMoedaSelic(
            mediaMensal
        )
    );


    console.log(
        "📈 Simulação Selic:",
        {
            selicAtual,
            taxaMensal,
            valorInicial,
            aporteMensal,
            meses,
            totalInvestido,
            rendimentoBruto,
            aliquota,
            impostoRenda,
            rendimentoLiquido,
            patrimonioFinal
        }
    );

}


// ==========================================
// ATUALIZAR ELEMENTO
// ==========================================

function atualizarSelic(
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

function limparSelic() {

    const valorInicial =
        document.getElementById(
            "selicValorInicial"
        );


    const aporte =
        document.getElementById(
            "selicAporteMensal"
        );


    const meses =
        document.getElementById(
            "selicMeses"
        );


    if (valorInicial) {

        valorInicial.value = "";

    }


    if (aporte) {

        aporte.value = "";

    }


    if (meses) {

        meses.value = "";

    }


    atualizarSelic(
        "selicTotalInvestido",
        "R$ 0,00"
    );


    atualizarSelic(
        "selicRendimentoBruto",
        "R$ 0,00"
    );


    atualizarSelic(
        "selicIr",
        "R$ 0,00"
    );


    atualizarSelic(
        "selicAliquota",
        "Alíquota: 0%"
    );


    atualizarSelic(
        "selicRendimentoLiquido",
        "R$ 0,00"
    );


    atualizarSelic(
        "selicPatrimonioFinal",
        "R$ 0,00"
    );


    atualizarSelic(
        "selicMediaMensal",
        "R$ 0,00"
    );

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarSelicAtual();

    }
);


console.log(
    "📈 Calculadora Selic carregada!"
);