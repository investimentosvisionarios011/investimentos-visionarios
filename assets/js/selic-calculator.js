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
// OBTER VALOR NUMÉRICO
// Aceita valores como:
// R$ 10.000,00
// 10.000,00
// 10000
// ==========================================

function obterValorNumericoSelic(valor) {

    if (valor === null || valor === undefined) {
        return 0;
    }

    let texto = String(valor).trim();

    if (!texto) {
        return 0;
    }

    // Remove R$, espaços e outros caracteres
    texto = texto.replace(/[^\d,.-]/g, "");

    // Se houver vírgula, considera formato brasileiro
    if (texto.includes(",")) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    } else {

        // Caso seja apenas número
        // mantém o ponto como decimal
        texto = texto.replace(/(\..*)\./g, "$1");

    }

    const numero = Number(texto);

    return Number.isFinite(numero)
        ? numero
        : 0;

}


// ==========================================
// PREPARAR CAMPOS MONETÁRIOS
// ==========================================

function prepararCamposMonetariosSelic() {

    const campos = [
        "selicValorInicial",
        "selicAporteMensal"
    ];


    campos.forEach(function(id) {

        const campo =
            document.getElementById(id);


        if (!campo) {
            return;
        }


        campo.type = "text";
        campo.inputMode = "decimal";


        // ------------------------------------------
        // Ao entrar no campo
        // mostra somente o número
        // ------------------------------------------

        campo.addEventListener(
            "focus",
            function() {

                const valor =
                    obterValorNumericoSelic(
                        campo.value
                    );


                if (valor > 0) {

                    campo.value =
                        String(valor)
                            .replace(".", ",");

                } else {

                    campo.value = "";

                }

            }
        );


        // ------------------------------------------
        // Ao sair do campo
        // aplica máscara R$
        // ------------------------------------------

        campo.addEventListener(
            "blur",
            function() {

                const valor =
                    obterValorNumericoSelic(
                        campo.value
                    );


                if (valor > 0) {

                    campo.value =
                        formatarMoedaSelic(
                            valor
                        );

                } else {

                    campo.value = "";

                }

            }
        );

    });

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
// OBTER PRAZO EM MESES
// ==========================================

function obterPrazoEmMesesSelic() {

    const campoPrazo =
        document.getElementById(
            "selicMeses"
        );


    const unidadePrazo =
        document.getElementById(
            "selicUnidadePrazo"
        );


    const valorPrazo =
        Number(
            campoPrazo?.value
        );


    if (
        !Number.isFinite(valorPrazo) ||
        valorPrazo <= 0
    ) {

        return 0;

    }


    const unidade =
        unidadePrazo?.value ||
        "meses";


    if (unidade === "anos") {

        return Math.round(
            valorPrazo * 12
        );

    }


    return Math.round(
        valorPrazo
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
        obterValorNumericoSelic(
            document.getElementById(
                "selicValorInicial"
            )?.value
        );


    const aporteMensal =
        obterValorNumericoSelic(
            document.getElementById(
                "selicAporteMensal"
            )?.value
        );


    const meses =
        obterPrazoEmMesesSelic();


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
            "Informe um prazo válido em meses ou anos."
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


    const prazo =
        document.getElementById(
            "selicMeses"
        );


    const unidadePrazo =
        document.getElementById(
            "selicUnidadePrazo"
        );


    if (valorInicial) {

        valorInicial.value = "";

    }


    if (aporte) {

        aporte.value = "";

    }


    if (prazo) {

        prazo.value = "";

    }


    if (unidadePrazo) {

        unidadePrazo.value = "meses";

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

        prepararCamposMonetariosSelic();

        carregarSelicAtual();

    }
);


console.log(
    "📈 Calculadora Selic carregada!"
);