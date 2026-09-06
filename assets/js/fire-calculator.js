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
// CALCULAR
// ==========================================

function calcularFIRE() {

    const custoMensal =
        Number(
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
        Number(
            document.getElementById(
                "firePatrimonioAtual"
            )?.value
        ) || 0;


    const aporteMensal =
        Number(
            document.getElementById(
                "fireAporteMensal"
            )?.value
        ) || 0;


    const rentabilidadeAnual =
        Number(
            document.getElementById(
                "fireRentabilidade"
            )?.value
        );


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
        Math.pow(
            1 + rentabilidadeAnual / 100,
            1 / 12
        ) - 1;


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
            tempo: textoTempo
        }
    );

}


// ==========================================
// ATUALIZAR RESULTADOS
// ==========================================

function atualizarFIRE(id, valor) {

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


    if (custo) custo.value = "";

    if (taxa) taxa.value = "4";

    if (patrimonio) patrimonio.value = "";

    if (aporte) aporte.value = "";

    if (rentabilidade) rentabilidade.value = "";


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


console.log(
    "🔥 Calculadora FIRE carregada!"
);