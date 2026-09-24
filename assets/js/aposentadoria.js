// ==========================================
// CALCULADORA DE APOSENTADORIA
// Investimentos Visionários
// ==========================================


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaAposentadoria(valor) {

    return Number(valor || 0).toLocaleString(
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
// Converte R$ 10.000,00 para 10000
// ==========================================

function obterValorNumericoAposentadoria(valor) {

    if (valor === null || valor === undefined) {
        return 0;
    }

    let texto = String(valor).trim();

    if (!texto) {
        return 0;
    }

    // Remove R$, espaços e outros caracteres
    texto = texto.replace(/[^\d,.-]/g, "");

    // Caso esteja no padrão brasileiro:
    // 10.000,00 -> 10000.00
    if (
        texto.includes(",") &&
        texto.includes(".")
    ) {

        texto = texto.replace(/\./g, "");
        texto = texto.replace(",", ".");

    }
    else if (texto.includes(",")) {

        texto = texto.replace(",", ".");

    }

    const numero = Number(texto);

    return Number.isFinite(numero)
        ? numero
        : 0;

}


// ==========================================
// PREPARAR CAMPOS MONETÁRIOS
// ==========================================

function prepararCamposMonetariosAposentadoria() {

    const campos = [
        "aposPatrimonioAtual",
        "aposAporteMensal"
    ];


    campos.forEach(
        function(id) {

            const campo =
                document.getElementById(id);


            if (!campo) {
                return;
            }


            campo.type = "text";
            campo.inputMode = "decimal";


            campo.addEventListener(
                "focus",
                function() {

                    const valor =
                        obterValorNumericoAposentadoria(
                            campo.value
                        );


                    if (valor > 0) {

                        campo.value =
                            valor
                            .toString()
                            .replace(".", ",");

                    }
                    else {

                        campo.value = "";

                    }

                }
            );


            campo.addEventListener(
                "blur",
                function() {

                    const valor =
                        obterValorNumericoAposentadoria(
                            campo.value
                        );


                    if (valor > 0) {

                        campo.value =
                            formatarMoedaAposentadoria(
                                valor
                            );

                    }
                    else {

                        campo.value = "";

                    }

                }
            );

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
// CONVERTER TAXA MENSAL PARA ANUAL
// ==========================================

function taxaAnualAposentadoria(taxaMensal) {

    return (
        Math.pow(
            1 + taxaMensal / 100,
            12
        ) - 1
    ) * 100;

}


// ==========================================
// OBTER RENTABILIDADE ANUAL
// ==========================================

function obterRentabilidadeAnualAposentadoria() {

    const campo =
        document.getElementById(
            "aposRentabilidade"
        );


    const unidade =
        document.getElementById(
            "aposUnidadeRentabilidade"
        );


    if (!campo) {
        return 0;
    }


    const taxa =
        Number(
            String(campo.value)
                .replace(",", ".")
        );


    if (!Number.isFinite(taxa)) {
        return 0;
    }


    // Se já estiver em % ao ano
    if (
        !unidade ||
        unidade.value === "anual"
    ) {

        return taxa;

    }


    // Se estiver em % ao mês,
    // converte matematicamente para anual
    return taxaAnualAposentadoria(taxa);

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
        obterValorNumericoAposentadoria(
            document.getElementById(
                "aposPatrimonioAtual"
            )?.value
        );


    const aporteMensal =
        obterValorNumericoAposentadoria(
            document.getElementById(
                "aposAporteMensal"
            )?.value
        );


    const rentabilidadeAnual =
        obterRentabilidadeAnualAposentadoria();


    const taxaRetirada =
        Number(
            String(
                document.getElementById(
                    "aposTaxaRetirada"
                )?.value
            ).replace(",", ".")
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
            "Informe uma rentabilidade válida."
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


    const unidadeRentabilidade =
        document.getElementById(
            "aposUnidadeRentabilidade"
        );


    const retirada =
        document.getElementById(
            "aposTaxaRetirada"
        );


    if (rentabilidade) {

        rentabilidade.value = "8";

    }


    if (unidadeRentabilidade) {

        unidadeRentabilidade.value = "anual";

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


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        prepararCamposMonetariosAposentadoria();

    }
);


console.log(
    "🏖️ Calculadora de Aposentadoria carregada!"
);