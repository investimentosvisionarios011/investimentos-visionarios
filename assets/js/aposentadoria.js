// ==========================================
// CALCULADORA DE APOSENTADORIA
// Investimentos Visionários
// ==========================================


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaAposentadoria(valor) {

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
// CONVERTER TAXA ANUAL PARA MENSAL
// ==========================================

function taxaMensalAposentadoria(taxaAnual) {

    return (
        Math.pow(
            1 + taxaAnual / 100,
            1 / 12
        ) - 1
    );

}


// ==========================================
// CALCULAR
// ==========================================

function calcularAposentadoria() {

    const idadeAtual =
        Number(
            document.getElementById(
                "aposIdadeAtual"
            )?.value
        );


    const idadeAposentadoria =
        Number(
            document.getElementById(
                "aposIdadeAposentadoria"
            )?.value
        );


    const patrimonioAtual =
        Number(
            document.getElementById(
                "aposPatrimonioAtual"
            )?.value
        ) || 0;


    const aporteMensal =
        Number(
            document.getElementById(
                "aposAporteMensal"
            )?.value
        ) || 0;


    const rentabilidadeAnual =
        Number(
            document.getElementById(
                "aposRentabilidade"
            )?.value
        );


    const taxaRetirada =
        Number(
            document.getElementById(
                "aposTaxaRetirada"
            )?.value
        );


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        !Number.isFinite(idadeAtual) ||
        idadeAtual < 18
    ) {

        alert(
            "Informe uma idade atual válida."
        );

        return;

    }


    if (
        !Number.isFinite(idadeAposentadoria) ||
        idadeAposentadoria <= idadeAtual
    ) {

        alert(
            "A idade de aposentadoria deve ser maior que a idade atual."
        );

        return;

    }


    if (
        patrimonioAtual <= 0 &&
        aporteMensal <= 0
    ) {

        alert(
            "Informe um patrimônio atual ou um aporte mensal."
        );

        return;

    }


    if (
        !Number.isFinite(rentabilidadeAnual) ||
        rentabilidadeAnual < 0
    ) {

        alert(
            "Informe uma rentabilidade anual válida."
        );

        return;

    }


    if (
        !Number.isFinite(taxaRetirada) ||
        taxaRetirada <= 0
    ) {

        alert(
            "Informe uma taxa de retirada válida."
        );

        return;

    }


    // ==========================================
    // TEMPO
    // ==========================================

    const anos =
        idadeAposentadoria -
        idadeAtual;


    const meses =
        anos * 12;


    // ==========================================
    // TAXA MENSAL
    // ==========================================

    const taxaMensal =
        taxaMensalAposentadoria(
            rentabilidadeAnual
        );


    // ==========================================
    // EVOLUÇÃO DO PATRIMÔNIO
    // ==========================================

    let patrimonio =
        patrimonioAtual;


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
    // TOTAL APORTADO
    // ==========================================

    const totalAportado =
        patrimonioAtual +
        (
            aporteMensal *
            meses
        );


    // ==========================================
    // RENDIMENTOS
    // ==========================================

    const rendimentos =
        Math.max(
            patrimonio -
            totalAportado,
            0
        );


    // ==========================================
    // RENDA DE APOSENTADORIA
    // ==========================================

    const rendaAnual =
        patrimonio *
        (
            taxaRetirada /
            100
        );


    const rendaMensal =
        rendaAnual / 12;


    // ==========================================
    // MULTIPLICAÇÃO DO CAPITAL
    // ==========================================

    const multiplicacao =
        totalAportado > 0
            ? patrimonio /
              totalAportado
            : 0;


    // ==========================================
    // MOSTRAR RESULTADOS
    // ==========================================

    atualizarAposentadoria(
        "aposTempo",
        anos === 1
            ? "1 ano"
            : anos + " anos"
    );


    atualizarAposentadoria(
        "aposTotalAportado",
        formatarMoedaAposentadoria(
            totalAportado
        )
    );


    atualizarAposentadoria(
        "aposRendimentos",
        formatarMoedaAposentadoria(
            rendimentos
        )
    );


    atualizarAposentadoria(
        "aposPatrimonioFinal",
        formatarMoedaAposentadoria(
            patrimonio
        )
    );


    atualizarAposentadoria(
        "aposRendaAnual",
        formatarMoedaAposentadoria(
            rendaAnual
        )
    );


    atualizarAposentadoria(
        "aposRendaMensal",
        formatarMoedaAposentadoria(
            rendaMensal
        )
    );


    atualizarAposentadoria(
        "aposMultiplicacao",
        multiplicacao
            .toFixed(2)
            .replace(".", ",") +
        "x"
    );


    console.log(
        "🏖️ Projeção de aposentadoria:",
        {
            idadeAtual,
            idadeAposentadoria,
            anos,
            meses,
            patrimonioAtual,
            aporteMensal,
            rentabilidadeAnual,
            taxaRetirada,
            totalAportado,
            rendimentos,
            patrimonio,
            rendaAnual,
            rendaMensal,
            multiplicacao
        }
    );

}


// ==========================================
// ATUALIZAR ELEMENTO
// ==========================================

function atualizarAposentadoria(
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

function limparAposentadoria() {

    const campos = [
        "aposIdadeAtual",
        "aposIdadeAposentadoria",
        "aposPatrimonioAtual",
        "aposAporteMensal"
    ];


    campos.forEach(
        function(id) {

            const campo =
                document.getElementById(id);


            if (campo) {

                campo.value = "";

            }

        }
    );


    const rentabilidade =
        document.getElementById(
            "aposRentabilidade"
        );


    const retirada =
        document.getElementById(
            "aposTaxaRetirada"
        );


    if (rentabilidade) {

        rentabilidade.value = "8";

    }


    if (retirada) {

        retirada.value = "4";

    }


    atualizarAposentadoria(
        "aposTempo",
        "--"
    );


    atualizarAposentadoria(
        "aposTotalAportado",
        "R$ 0,00"
    );


    atualizarAposentadoria(
        "aposRendimentos",
        "R$ 0,00"
    );


    atualizarAposentadoria(
        "aposPatrimonioFinal",
        "R$ 0,00"
    );


    atualizarAposentadoria(
        "aposRendaAnual",
        "R$ 0,00"
    );


    atualizarAposentadoria(
        "aposRendaMensal",
        "R$ 0,00"
    );


    atualizarAposentadoria(
        "aposMultiplicacao",
        "0,00x"
    );

}


console.log(
    "🏖️ Calculadora de Aposentadoria carregada!"
);