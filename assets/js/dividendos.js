// ==========================================
// CALCULADORA DE DIVIDENDOS
// Investimentos Visionários
// ==========================================


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaDividendos(valor) {

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
// CALCULAR
// ==========================================

function calcularDividendos() {

    const patrimonio =
        Number(
            document.getElementById(
                "divPatrimonio"
            )?.value
        ) || 0;


    const dividendYield =
        Number(
            document.getElementById(
                "divYield"
            )?.value
        );


    const rendaDesejada =
        Number(
            document.getElementById(
                "divRendaDesejada"
            )?.value
        ) || 0;


    if (
        patrimonio <= 0
    ) {

        alert(
            "Informe um patrimônio investido maior que zero."
        );

        return;

    }


    if (
        !Number.isFinite(dividendYield) ||
        dividendYield <= 0
    ) {

        alert(
            "Informe um Dividend Yield maior que zero."
        );

        return;

    }


    // ==========================================
    // RENDA GERADA
    // ==========================================

    const rendaAnual =
        patrimonio *
        (dividendYield / 100);


    const rendaMensal =
        rendaAnual / 12;


    // ==========================================
    // PATRIMÔNIO NECESSÁRIO
    // ==========================================

    let patrimonioNecessario = 0;
    let quantoFalta = 0;
    let percentualMeta = 0;


    if (
        rendaDesejada > 0
    ) {

        const rendaAnualDesejada =
            rendaDesejada * 12;


        patrimonioNecessario =
            rendaAnualDesejada /
            (dividendYield / 100);


        quantoFalta =
            Math.max(
                patrimonioNecessario -
                patrimonio,
                0
            );


        percentualMeta =
            patrimonioNecessario > 0
                ? (
                    patrimonio /
                    patrimonioNecessario
                ) * 100
                : 0;


        percentualMeta =
            Math.min(
                percentualMeta,
                100
            );

    }


    // ==========================================
    // RESULTADOS
    // ==========================================

    atualizarDividendos(
        "divRendaAnual",
        formatarMoedaDividendos(
            rendaAnual
        )
    );


    atualizarDividendos(
        "divRendaMensal",
        formatarMoedaDividendos(
            rendaMensal
        )
    );


    atualizarDividendos(
        "divYieldResultado",
        dividendYield
            .toFixed(2)
            .replace(".", ",") +
        "%"
    );


    atualizarDividendos(
        "divPatrimonioNecessario",
        rendaDesejada > 0
            ? formatarMoedaDividendos(
                patrimonioNecessario
            )
            : "Informe uma renda desejada"
    );


    atualizarDividendos(
        "divQuantoFalta",
        rendaDesejada > 0
            ? formatarMoedaDividendos(
                quantoFalta
            )
            : "R$ 0,00"
    );


    // ==========================================
    // BARRA DE PROGRESSO
    // ==========================================

    const progresso =
        document.getElementById(
            "divProgresso"
        );


    if (progresso) {

        const percentual =
            rendaDesejada > 0
                ? percentualMeta
                : 0;


        progresso.style.width =
            percentual + "%";


        progresso.textContent =
            percentual
                .toFixed(1)
                .replace(".", ",") +
            "%";

    }


    console.log(
        "💰 Dividendos calculados:",
        {
            patrimonio,
            dividendYield,
            rendaAnual,
            rendaMensal,
            rendaDesejada,
            patrimonioNecessario,
            quantoFalta,
            percentualMeta
        }
    );

}


// ==========================================
// ATUALIZAR ELEMENTO
// ==========================================

function atualizarDividendos(
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

function limparDividendos() {

    const patrimonio =
        document.getElementById(
            "divPatrimonio"
        );


    const yieldInput =
        document.getElementById(
            "divYield"
        );


    const renda =
        document.getElementById(
            "divRendaDesejada"
        );


    if (patrimonio) {
        patrimonio.value = "";
    }


    if (yieldInput) {
        yieldInput.value = "";
    }


    if (renda) {
        renda.value = "";
    }


    atualizarDividendos(
        "divRendaAnual",
        "R$ 0,00"
    );


    atualizarDividendos(
        "divRendaMensal",
        "R$ 0,00"
    );


    atualizarDividendos(
        "divYieldResultado",
        "0,00%"
    );


    atualizarDividendos(
        "divPatrimonioNecessario",
        "R$ 0,00"
    );


    atualizarDividendos(
        "divQuantoFalta",
        "R$ 0,00"
    );


    const progresso =
        document.getElementById(
            "divProgresso"
        );


    if (progresso) {

        progresso.style.width =
            "0%";


        progresso.textContent =
            "0%";

    }

}


console.log(
    "💰 Calculadora de Dividendos carregada!"
);