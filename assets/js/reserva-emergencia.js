// ==========================================
// CALCULADORA DE RESERVA DE EMERGÊNCIA
// Investimentos Visionários
// ==========================================


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaReserva(valor) {

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

function calcularReserva() {

    const despesas =
        Number(
            document.getElementById(
                "reservaDespesas"
            )?.value
        );


    const mesesReserva =
        Number(
            document.getElementById(
                "reservaPerfil"
            )?.value
        );


    const valorAtual =
        Number(
            document.getElementById(
                "reservaAtual"
            )?.value
        ) || 0;


    const aporte =
        Number(
            document.getElementById(
                "reservaAporte"
            )?.value
        ) || 0;


    if (
        !Number.isFinite(despesas) ||
        despesas <= 0
    ) {

        alert(
            "Informe suas despesas essenciais mensais."
        );

        return;

    }


    if (
        !Number.isFinite(mesesReserva) ||
        mesesReserva <= 0
    ) {

        alert(
            "Selecione um perfil válido."
        );

        return;

    }


    if (
        valorAtual < 0 ||
        aporte < 0
    ) {

        alert(
            "Os valores informados não podem ser negativos."
        );

        return;

    }


    // ==========================================
    // META
    // ==========================================

    const meta =
        despesas *
        mesesReserva;


    // ==========================================
    // QUANTO FALTA
    // ==========================================

    const falta =
        Math.max(
            meta -
            valorAtual,
            0
        );


    // ==========================================
    // PERCENTUAL ATINGIDO
    // ==========================================

    const percentual =
        Math.min(
            (
                valorAtual /
                meta
            ) * 100,
            100
        );


    // ==========================================
    // TEMPO PARA COMPLETAR
    // ==========================================

    let textoTempo =
        "--";


    if (falta <= 0) {

        textoTempo =
            "Meta atingida ✅";

    }

    else if (aporte > 0) {

        const meses =
            Math.ceil(
                falta /
                aporte
            );


        if (meses === 1) {

            textoTempo =
                "1 mês";

        }

        else if (meses < 12) {

            textoTempo =
                `${meses} meses`;

        }

        else {

            const anos =
                Math.floor(
                    meses / 12
                );


            const mesesRestantes =
                meses % 12;


            if (
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

    else {

        textoTempo =
            "Informe um aporte mensal";

    }


    // ==========================================
    // RESULTADOS
    // ==========================================

    atualizarReserva(
        "reservaMeta",
        formatarMoedaReserva(
            meta
        )
    );


    atualizarReserva(
        "reservaAtualResultado",
        formatarMoedaReserva(
            valorAtual
        )
    );


    atualizarReserva(
        "reservaFalta",
        formatarMoedaReserva(
            falta
        )
    );


    atualizarReserva(
        "reservaPercentual",
        percentual
            .toFixed(1)
            .replace(".", ",")
        + "%"
    );


    atualizarReserva(
        "reservaTempo",
        textoTempo
    );


    console.log(
        "✅ Reserva calculada:",
        {
            despesas,
            mesesReserva,
            meta,
            valorAtual,
            falta,
            percentual,
            aporte,
            tempo: textoTempo
        }
    );

}


// ==========================================
// ATUALIZAR RESULTADO
// ==========================================

function atualizarReserva(
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

function limparReserva() {

    const despesas =
        document.getElementById(
            "reservaDespesas"
        );


    const perfil =
        document.getElementById(
            "reservaPerfil"
        );


    const atual =
        document.getElementById(
            "reservaAtual"
        );


    const aporte =
        document.getElementById(
            "reservaAporte"
        );


    if (despesas) despesas.value = "";

    if (perfil) perfil.value = "6";

    if (atual) atual.value = "";

    if (aporte) aporte.value = "";


    atualizarReserva(
        "reservaMeta",
        "R$ 0,00"
    );


    atualizarReserva(
        "reservaAtualResultado",
        "R$ 0,00"
    );


    atualizarReserva(
        "reservaFalta",
        "R$ 0,00"
    );


    atualizarReserva(
        "reservaPercentual",
        "0%"
    );


    atualizarReserva(
        "reservaTempo",
        "--"
    );

}


console.log(
    "🛡️ Calculadora de Reserva de Emergência carregada!"
);