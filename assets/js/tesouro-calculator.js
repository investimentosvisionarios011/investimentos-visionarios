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
// OBTER VALOR MONETÁRIO
// Aceita:
// 10000
// 10.000
// 10.000,00
// R$ 10.000,00
// ==========================================

function obterValorNumericoTesouro(valor) {

    if (valor === null || valor === undefined) {

        return 0;

    }

    let texto =
        String(valor)
            .trim()
            .replace(/\s/g, "")
            .replace(/R\$/gi, "");

    if (!texto) {

        return 0;

    }

    // Quando houver vírgula,
    // considera a vírgula como separador decimal.
    if (texto.includes(",")) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    } else {

        // Sem vírgula,
        // remove separadores de milhar.
        texto =
            texto.replace(/\./g, "");

    }

    const numero =
        Number(texto);

    return Number.isFinite(numero)
        ? numero
        : 0;

}


// ==========================================
// PREPARAR CAMPOS MONETÁRIOS
// ==========================================

function prepararCamposMonetariosTesouro() {

    const campos = [

        "tesouroValorInicial",

        "tesouroAporteMensal"

    ];


    campos.forEach(
        id => {

            const elemento =
                document.getElementById(id);


            if (!elemento) {

                return;

            }


            elemento.addEventListener(
                "focus",
                function() {

                    const valor =
                        obterValorNumericoTesouro(
                            elemento.value
                        );


                    elemento.value =
                        valor > 0
                            ? String(valor).replace(".", ",")
                            : "";

                }
            );


            elemento.addEventListener(
                "input",
                function() {

                    // Permite somente números,
                    // vírgula e ponto.
                    elemento.value =
                        elemento.value.replace(
                            /[^\d.,]/g,
                            ""
                        );

                }
            );


            elemento.addEventListener(
                "blur",
                function() {

                    const valor =
                        obterValorNumericoTesouro(
                            elemento.value
                        );


                    elemento.value =
                        valor > 0
                            ? formatarMoedaTesouro(valor)
                            : "";

                }
            );

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
// CONVERSÕES DE TAXA
// ==========================================

// Converte taxa efetiva mensal para anual.

function converterTaxaMensalParaAnualTesouro(
    taxaMensal
) {

    return (
        Math.pow(
            1 + taxaMensal,
            12
        ) - 1
    );

}


// Converte taxa efetiva anual para mensal.

function converterTaxaAnualParaMensalTesouro(
    taxaAnual
) {

    return (
        Math.pow(
            1 + taxaAnual,
            1 / 12
        ) - 1
    );

}


// Converte a taxa informada para taxa anual.

function obterTaxaAnualTesouro(
    taxa,
    unidade
) {

    if (unidade === "mes") {

        return converterTaxaMensalParaAnualTesouro(
            taxa / 100
        ) * 100;

    }

    return taxa;

}


// ==========================================
// CONVERTER PRAZO PARA MESES
// ==========================================

function obterPrazoEmMesesTesouro() {

    const prazo =
        Number(
            document.getElementById(
                "tesouroPrazo"
            )?.value
        );


    const unidade =
        document.getElementById(
            "tesouroUnidadePrazo"
        )?.value || "meses";


    if (
        !Number.isFinite(prazo) ||
        prazo <= 0
    ) {

        return 0;

    }


    if (unidade === "anos") {

        return prazo * 12;

    }


    return prazo;

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
            "Taxa real do título";

    } else {

        grupoIpca.classList.add(
            "d-none"
        );


        labelTaxa.textContent =
            "Taxa do título";

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
        obterValorNumericoTesouro(
            document.getElementById(
                "tesouroValorInicial"
            )?.value
        );


    const aporteMensal =
        obterValorNumericoTesouro(
            document.getElementById(
                "tesouroAporteMensal"
            )?.value
        );


    const meses =
        obterPrazoEmMesesTesouro();


    const taxa =
        Number(
            document.getElementById(
                "tesouroTaxa"
            )?.value
        );


    const unidadeTaxa =
        document.getElementById(
            "tesouroUnidadeTaxa"
        )?.value || "ano";


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
    // TAXA REAL / NOMINAL EM BASE ANUAL
    // ==========================================

    let taxaAnual =
        obterTaxaAnualTesouro(
            taxa,
            unidadeTaxa
        );


    // ==========================================
    // TESOURO IPCA+
    // IPCA anual + taxa real anual
    // ==========================================

    if (tipo === "ipca") {

        taxaAnual =
            (
                (
                    1 + ipca / 100
                )
                *
                (
                    1 + taxaAnual / 100
                )
                - 1
            ) * 100;

    }


    // ==========================================
    // TAXA MENSAL EFETIVA
    // ==========================================

    const taxaMensal =
        converterTaxaAnualParaMensalTesouro(
            taxaAnual / 100
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


    const unidadePrazo =
        document.getElementById(
            "tesouroUnidadePrazo"
        );


    if (unidadePrazo) {

        unidadePrazo.value =
            "meses";

    }


    const unidadeTaxa =
        document.getElementById(
            "tesouroUnidadeTaxa"
        );


    if (unidadeTaxa) {

        unidadeTaxa.value =
            "ano";

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


        prepararCamposMonetariosTesouro();

        configurarTipoTesouro();

    }
);