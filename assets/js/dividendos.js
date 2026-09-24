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
// OBTER VALOR NUMÉRICO DOS CAMPOS
// ==========================================

function obterValorNumericoDividendos(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    let texto =
        String(valor)
            .trim();


    // ==========================================
    // REMOVER R$
    // ==========================================

    texto =
        texto.replace(
            /R\$\s?/g,
            ""
        );


    // ==========================================
    // FORMATO BRASILEIRO
    // Exemplo: 10.000,50
    // ==========================================

    if (
        texto.includes(",")
    ) {

        texto =
            texto.replace(
                /\./g,
                ""
            );


        texto =
            texto.replace(
                ",",
                "."
            );

    }


    // ==========================================
    // REMOVER CARACTERES RESTANTES
    // ==========================================

    texto =
        texto.replace(
            /[^\d.-]/g,
            ""
        );


    const numero =
        Number(texto);


    return Number.isFinite(numero)
        ? numero
        : 0;

}


// ==========================================
// PREPARAR CAMPOS MONETÁRIOS
// ==========================================

function prepararCamposMonetariosDividendos() {

    const campos =
        [
            "divPatrimonio",
            "divRendaDesejada"
        ];


    campos.forEach(
        function(id) {

            const campo =
                document.getElementById(id);


            if (!campo) {

                return;

            }


            // ==================================
            // ALTERAR TIPO
            // ==================================

            campo.type =
                "text";


            campo.inputMode =
                "decimal";


            // ==================================
            // AO ENTRAR NO CAMPO
            // ==================================

            campo.addEventListener(
                "focus",
                function() {

                    const valor =
                        obterValorNumericoDividendos(
                            campo.value
                        );


                    if (valor > 0) {

                        campo.value =
                            valor
                                .toFixed(2)
                                .replace(
                                    ".",
                                    ","
                                );

                    }

                }
            );


            // ==================================
            // AO SAIR DO CAMPO
            // ==================================

            campo.addEventListener(
                "blur",
                function() {

                    const valor =
                        obterValorNumericoDividendos(
                            campo.value
                        );


                    if (valor > 0) {

                        campo.value =
                            formatarMoedaDividendos(
                                valor
                            );

                    }

                    else {

                        campo.value =
                            "";

                    }

                }
            );

        }
    );

}


// ==========================================
// CALCULAR
// ==========================================

function calcularDividendos() {

    const patrimonio =
        obterValorNumericoDividendos(
            document.getElementById(
                "divPatrimonio"
            )?.value
        );


    const dividendYield =
        Number(
            document.getElementById(
                "divYield"
            )?.value
        );


    const rendaDesejada =
        obterValorNumericoDividendos(
            document.getElementById(
                "divRendaDesejada"
            )?.value
        );


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

        patrimonio.value =
            "";

    }


    if (yieldInput) {

        yieldInput.value =
            "";

    }


    if (renda) {

        renda.value =
            "";

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


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        prepararCamposMonetariosDividendos();

        console.log(
            "💰 Calculadora de Dividendos carregada!"
        );

    }
);