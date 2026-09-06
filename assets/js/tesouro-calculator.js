// ==========================================
// CALCULADORA TESOURO DIRETO
// Investimentos Visionários
// ==========================================


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaTesouro(valor) {

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
// IR REGRESSIVO
// ==========================================

function obterAliquotaIrTesouro(meses) {

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

function converterTaxaTesouro(
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
// ALTERAR CAMPOS PELO TIPO
// ==========================================

function configurarTipoTesouro() {

    const tipo =
        document.getElementById(
            "tesouroTipo"
        )?.value;


    const grupoIpca =
        document.getElementById(
            "grupoIpcaTesouro"
        );


    const labelTaxa =
        document.querySelector(
            'label[for="tesouroTaxa"]'
        );


    if (!grupoIpca || !labelTaxa) {

        return;

    }


    if (tipo === "ipca") {

        grupoIpca.classList.remove(
            "d-none"
        );


        labelTaxa.textContent =
            "Taxa real do título (% a.a.)";

    } else {

        grupoIpca.classList.add(
            "d-none"
        );


        labelTaxa.textContent =
            "Taxa anual (%)";

    }

}


// ==========================================
// CALCULAR
// ==========================================

function calcularTesouro() {

    const tipo =
        document.getElementById(
            "tesouroTipo"
        )?.value;


    const valorInicial =
        Number(
            document.getElementById(
                "tesouroValorInicial"
            )?.value
        ) || 0;


    const aporteMensal =
        Number(
            document.getElementById(
                "tesouroAporteMensal"
            )?.value
        ) || 0;


    const meses =
        Number(
            document.getElementById(
                "tesouroPrazo"
            )?.value
        );


    const taxa =
        Number(
            document.getElementById(
                "tesouroTaxa"
            )?.value
        );


    const ipca =
        Number(
            document.getElementById(
                "tesouroIpca"
            )?.value
        ) || 0;


    if (
        valorInicial <= 0 &&
        aporteMensal <= 0
    ) {

        alert(
            "Informe um valor inicial ou aporte mensal."
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


    if (
        !Number.isFinite(taxa) ||
        taxa < 0
    ) {

        alert(
            "Informe uma taxa válida."
        );

        return;

    }


    if (
        tipo === "ipca" &&
        (
            !Number.isFinite(ipca) ||
            ipca < 0
        )
    ) {

        alert(
            "Informe um IPCA válido."
        );

        return;

    }


    // ==========================================
    // TAXA NOMINAL
    // ==========================================

    let taxaAnual =
        taxa;


    if (tipo === "ipca") {

        taxaAnual =
            (
                (
                    1 + ipca / 100
                )
                *
                (
                    1 + taxa / 100
                )
                - 1
            ) * 100;

    }


    // ==========================================
    // TAXA MENSAL
    // ==========================================

    const taxaMensal =
        converterTaxaTesouro(
            taxaAnual
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
    // IR
    // ==========================================

    const aliquotaIr =
        obterAliquotaIrTesouro(
            meses
        );


    const imposto =
        rendimentoBruto *
        (
            aliquotaIr / 100
        );


    // ==========================================
    // RESULTADO LÍQUIDO
    // ==========================================

    const rendimentoLiquido =
        rendimentoBruto -
        imposto;


    const patrimonioFinal =
        totalInvestido +
        rendimentoLiquido;


    // ==========================================
    // MOSTRAR RESULTADOS
    // ==========================================

    atualizarResultadoTesouro(
        "tesouroTotalInvestido",
        formatarMoedaTesouro(
            totalInvestido
        )
    );


    atualizarResultadoTesouro(
        "tesouroRendimentoBruto",
        formatarMoedaTesouro(
            rendimentoBruto
        )
    );


    atualizarResultadoTesouro(
        "tesouroImpostoRenda",
        formatarMoedaTesouro(
            imposto
        )
    );


    atualizarResultadoTesouro(
        "tesouroAliquotaIr",
        aliquotaIr
            .toFixed(1)
            .replace(".", ",")
        + "%"
    );


    atualizarResultadoTesouro(
        "tesouroRendimentoLiquido",
        formatarMoedaTesouro(
            rendimentoLiquido
        )
    );


    atualizarResultadoTesouro(
        "tesouroPatrimonioFinal",
        formatarMoedaTesouro(
            patrimonioFinal
        )
    );

}


// ==========================================
// ATUALIZAR RESULTADO
// ==========================================

function atualizarResultadoTesouro(
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

function limparTesouro() {

    const campos = [

        "tesouroValorInicial",

        "tesouroAporteMensal",

        "tesouroPrazo",

        "tesouroTaxa",

        "tesouroIpca"

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


    const tipo =
        document.getElementById(
            "tesouroTipo"
        );


    if (tipo) {

        tipo.value =
            "selic";

    }


    configurarTipoTesouro();


    atualizarResultadoTesouro(
        "tesouroTotalInvestido",
        "R$ 0,00"
    );


    atualizarResultadoTesouro(
        "tesouroRendimentoBruto",
        "R$ 0,00"
    );


    atualizarResultadoTesouro(
        "tesouroImpostoRenda",
        "R$ 0,00"
    );


    atualizarResultadoTesouro(
        "tesouroAliquotaIr",
        "0%"
    );


    atualizarResultadoTesouro(
        "tesouroRendimentoLiquido",
        "R$ 0,00"
    );


    atualizarResultadoTesouro(
        "tesouroPatrimonioFinal",
        "R$ 0,00"
    );

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const tipo =
            document.getElementById(
                "tesouroTipo"
            );


        if (tipo) {

            tipo.addEventListener(
                "change",
                configurarTipoTesouro
            );

        }


        configurarTipoTesouro();

    }
);