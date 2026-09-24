// ==========================================
// CALCULADORA FIRE
// Investimentos Visionários
// ==========================================


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaFIRE(valor) {

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
// CONVERTER CAMPO MONETÁRIO
// ==========================================

function obterValorNumericoFIRE(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }

    let texto =
        String(valor)
            .trim()
            .replace(/R\$/gi, "")
            .replace(/\s/g, "");


    if (texto.includes(",")) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    } else {

        texto =
            texto.replace(/[^\d.-]/g, "");

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

function prepararCamposMonetariosFIRE() {

    const campos = [

        document.getElementById(
            "fireCustoMensal"
        ),

        document.getElementById(
            "firePatrimonioAtual"
        ),

        document.getElementById(
            "fireAporteMensal"
        )

    ];


    campos.forEach(campo => {

        if (!campo) {
            return;
        }


        campo.type = "text";

        campo.inputMode = "decimal";


        // ==================================
        // AO ENTRAR NO CAMPO
        // ==================================

        campo.addEventListener(
            "focus",
            function () {

                const numero =
                    obterValorNumericoFIRE(
                        this.value
                    );


                if (numero > 0) {

                    this.value =
                        numero
                            .toFixed(2)
                            .replace(".", ",");

                }

            }
        );


        // ==================================
        // AO SAIR DO CAMPO
        // ==================================

        campo.addEventListener(
            "blur",
            function () {

                const numero =
                    obterValorNumericoFIRE(
                        this.value
                    );


                if (numero > 0) {

                    this.value =
                        formatarMoedaFIRE(
                            numero
                        );

                } else {

                    this.value = "";

                }

            }
        );

    });

}


// ==========================================
// CONVERSÃO DE TAXAS
// ==========================================

function converterTaxaAnualParaMensalFIRE(
    taxaAnual
) {

    return Math.pow(
        1 + taxaAnual,
        1 / 12
    ) - 1;

}


function converterTaxaMensalParaAnualFIRE(
    taxaMensal
) {

    return Math.pow(
        1 + taxaMensal,
        12
    ) - 1;

}


// ==========================================
// OBTER RENTABILIDADE ANUAL
// ==========================================

function obterRentabilidadeAnualFIRE() {

    const rentabilidadeInformada =
        Number(
            document.getElementById(
                "fireRentabilidade"
            )?.value
        ) || 0;


    const unidade =
        document.getElementById(
            "fireUnidadeRentabilidade"
        )?.value || "anual";


    const taxaDecimal =
        rentabilidadeInformada / 100;


    if (unidade === "mensal") {

        return (
            converterTaxaMensalParaAnualFIRE(
                taxaDecimal
            ) * 100
        );

    }


    return rentabilidadeInformada;

}


// ==========================================
// CALCULAR
// ==========================================

function calcularFIRE() {

    const custoMensal =
        obterValorNumericoFIRE(
            document.getElementById(
                "fireCustoMensal"
            )?.value
        );


    const taxaRetirada =
        Number(
            document.getElementById(
                "fireTaxaRetirada"
            )?.value
        );


    const patrimonioAtual =
        obterValorNumericoFIRE(
            document.getElementById(
                "firePatrimonioAtual"
            )?.value
        );


    const aporteMensal =
        obterValorNumericoFIRE(
            document.getElementById(
                "fireAporteMensal"
            )?.value
        );


    const rentabilidadeAnual =
        obterRentabilidadeAnualFIRE();


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        !Number.isFinite(custoMensal) ||
        custoMensal <= 0
    ) {

        alert(
            "Informe um custo de vida mensal válido."
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


    if (
        patrimonioAtual < 0 ||
        aporteMensal < 0
    ) {

        alert(
            "Patrimônio e aporte não podem ser negativos."
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


    // ==========================================
    // RENDA ANUAL
    // ==========================================

    const rendaAnual =
        custoMensal * 12;


    // ==========================================
    // PATRIMÔNIO NECESSÁRIO
    // ==========================================

    const patrimonioNecessario =
        rendaAnual /
        (taxaRetirada / 100);


    // ==========================================
    // QUANTO FALTA
    // ==========================================

    const quantoFalta =
        Math.max(
            patrimonioNecessario -
            patrimonioAtual,
            0
        );


    // ==========================================
    // PERCENTUAL ATINGIDO
    // ==========================================

    const percentualMeta =
        Math.min(
            patrimonioAtual /
            patrimonioNecessario *
            100,
            100
        );


    // ==========================================
    // TAXA MENSAL
    // ==========================================

    const taxaMensal =
        converterTaxaAnualParaMensalFIRE(
            rentabilidadeAnual / 100
        );


    // ==========================================
    // TEMPO ESTIMADO
    // ==========================================

    let textoTempo = "--";


    if (
        patrimonioAtual >=
        patrimonioNecessario
    ) {

        textoTempo =
            "Meta atingida 🔥";

    }

    else if (
        aporteMensal <= 0 &&
        taxaMensal <= 0
    ) {

        textoTempo =
            "Informe aporte ou rentabilidade";

    }

    else {

        let patrimonio =
            patrimonioAtual;


        let meses =
            0;


        const limiteMeses =
            1200;


        while (
            patrimonio <
            patrimonioNecessario &&
            meses <
            limiteMeses
        ) {

            patrimonio *=
                1 + taxaMensal;


            patrimonio +=
                aporteMensal;


            meses++;

        }


        if (
            meses >= limiteMeses
        ) {

            textoTempo =
                "Mais de 100 anos";

        }

        else {

            const anos =
                Math.floor(
                    meses / 12
                );


            const mesesRestantes =
                meses % 12;


            if (
                anos === 0
            ) {

                textoTempo =
                    meses === 1
                        ? "1 mês"
                        : `${meses} meses`;

            }

            else if (
                mesesRestantes === 0
            ) {

                textoTempo =
                    anos === 1
                        ? "1 ano"
                        : `${anos} anos`;

            }

            else {

                textoTempo =
                    `${anos} ${
                        anos === 1
                            ? "ano"
                            : "anos"
                    } e ${mesesRestantes} ${
                        mesesRestantes === 1
                            ? "mês"
                            : "meses"
                    }`;

            }

        }

    }


    // ==========================================
    // RESULTADOS
    // ==========================================

    atualizarFIRE(
        "firePatrimonioNecessario",
        formatarMoedaFIRE(
            patrimonioNecessario
        )
    );


    atualizarFIRE(
        "fireRendaAnual",
        formatarMoedaFIRE(
            rendaAnual
        )
    );


    atualizarFIRE(
        "firePatrimonioAtualResultado",
        formatarMoedaFIRE(
            patrimonioAtual
        )
    );


    atualizarFIRE(
        "fireQuantoFalta",
        formatarMoedaFIRE(
            quantoFalta
        )
    );


    atualizarFIRE(
        "firePercentualMeta",
        percentualMeta
            .toFixed(1)
            .replace(".", ",")
        + "%"
    );


    atualizarFIRE(
        "fireTempoEstimado",
        textoTempo
    );


    console.log(
        "🔥 Simulação FIRE:",
        {
            custoMensal,
            rendaAnual,
            taxaRetirada,
            patrimonioNecessario,
            patrimonioAtual,
            quantoFalta,
            percentualMeta,
            aporteMensal,
            rentabilidadeAnual,
            taxaMensal,
            tempo: textoTempo
        }
    );

}


// ==========================================
// ATUALIZAR RESULTADOS
// ==========================================

function atualizarFIRE(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


// ==========================================
// LIMPAR
// ==========================================

function limparFIRE() {

    const custo =
        document.getElementById(
            "fireCustoMensal"
        );


    const taxa =
        document.getElementById(
            "fireTaxaRetirada"
        );


    const patrimonio =
        document.getElementById(
            "firePatrimonioAtual"
        );


    const aporte =
        document.getElementById(
            "fireAporteMensal"
        );


    const rentabilidade =
        document.getElementById(
            "fireRentabilidade"
        );


    const unidadeRentabilidade =
        document.getElementById(
            "fireUnidadeRentabilidade"
        );


    if (custo) {

        custo.value = "";

    }


    if (taxa) {

        taxa.value = "4";

    }


    if (patrimonio) {

        patrimonio.value = "";

    }


    if (aporte) {

        aporte.value = "";

    }


    if (rentabilidade) {

        rentabilidade.value = "";

    }


    if (unidadeRentabilidade) {

        unidadeRentabilidade.value =
            "anual";

    }


    atualizarFIRE(
        "firePatrimonioNecessario",
        "R$ 0,00"
    );


    atualizarFIRE(
        "fireRendaAnual",
        "R$ 0,00"
    );


    atualizarFIRE(
        "firePatrimonioAtualResultado",
        "R$ 0,00"
    );


    atualizarFIRE(
        "fireQuantoFalta",
        "R$ 0,00"
    );


    atualizarFIRE(
        "firePercentualMeta",
        "0%"
    );


    atualizarFIRE(
        "fireTempoEstimado",
        "--"
    );

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        prepararCamposMonetariosFIRE();

        console.log(
            "🔥 Calculadora FIRE carregada!"
        );

    }
);