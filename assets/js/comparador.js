// ==========================================
// COMPARADOR DE INVESTIMENTOS
// Investimentos Visionários
// ==========================================


let comparadorSelicAtual = 0;
let comparadorCdiAtual = 0;


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaComparador(valor) {

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

function obterValorNumericoComparador(valor) {

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

function prepararCamposMonetariosComparador() {

    const campos = [

        document.getElementById(
            "comparadorValorInicial"
        ),

        document.getElementById(
            "comparadorAporte"
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
                    obterValorNumericoComparador(
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
                    obterValorNumericoComparador(
                        this.value
                    );


                if (numero > 0) {

                    this.value =
                        formatarMoedaComparador(
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
// OBTER PRAZO EM MESES
// ==========================================

function obterPrazoEmMesesComparador() {

    const prazo =
        Number(
            document.getElementById(
                "comparadorMeses"
            )?.value
        );


    const unidade =
        document.getElementById(
            "comparadorUnidadePrazo"
        )?.value || "meses";


    if (!Number.isFinite(prazo)) {

        return 0;

    }


    if (unidade === "anos") {

        return Math.round(
            prazo * 12
        );

    }


    return Math.round(prazo);

}


// ==========================================
// CARREGAR TAXAS
// ==========================================

async function carregarTaxasComparador() {

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


        comparadorSelicAtual =
            Number(
                dados?.selic?.valor
            );


        comparadorCdiAtual =
            Number(
                dados?.cdi?.valorAnual
            );


        if (
            !Number.isFinite(
                comparadorSelicAtual
            ) ||
            comparadorSelicAtual <= 0
        ) {

            throw new Error(
                "Selic inválida."
            );

        }


        if (
            !Number.isFinite(
                comparadorCdiAtual
            ) ||
            comparadorCdiAtual <= 0
        ) {

            throw new Error(
                "CDI inválido."
            );

        }


        const elementoSelic =
            document.getElementById(
                "comparadorSelic"
            );


        if (elementoSelic) {

            elementoSelic.textContent =
                comparadorSelicAtual
                    .toFixed(2)
                    .replace(".", ",")
                + "%";

        }


        const elementoCdi =
            document.getElementById(
                "comparadorCdi"
            );


        if (elementoCdi) {

            elementoCdi.textContent =
                comparadorCdiAtual
                    .toFixed(2)
                    .replace(".", ",")
                + "%";

        }


        console.log(
            "✅ Taxas carregadas:",
            {
                selic: comparadorSelicAtual,
                cdi: comparadorCdiAtual
            }
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar taxas:",
            erro
        );


        const selic =
            document.getElementById(
                "comparadorSelic"
            );


        const cdi =
            document.getElementById(
                "comparadorCdi"
            );


        if (selic) {

            selic.textContent =
                "Indisponível";

        }


        if (cdi) {

            cdi.textContent =
                "Indisponível";

        }

    }

}


// ==========================================
// ALÍQUOTA IR
// ==========================================

function obterAliquotaComparador(meses) {

    if (meses <= 6) return 22.5;

    if (meses <= 12) return 20;

    if (meses <= 24) return 17.5;

    return 15;

}


// ==========================================
// TAXA ANUAL PARA MENSAL
// ==========================================

function taxaMensalComparador(
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
// SIMULAR INVESTIMENTO
// ==========================================

function simularComparador(
    valorInicial,
    aporteMensal,
    meses,
    taxaAnual
) {

    const taxaMensal =
        taxaMensalComparador(
            taxaAnual
        );


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


    return patrimonio;

}


// ==========================================
// CALCULAR
// ==========================================

function calcularComparador() {

    const valorInicial =
        obterValorNumericoComparador(
            document.getElementById(
                "comparadorValorInicial"
            )?.value
        );


    const aporte =
        obterValorNumericoComparador(
            document.getElementById(
                "comparadorAporte"
            )?.value
        );


    const meses =
        obterPrazoEmMesesComparador();


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        comparadorSelicAtual <= 0 ||
        comparadorCdiAtual <= 0
    ) {

        alert(
            "As taxas ainda não foram carregadas."
        );

        return;

    }


    if (
        valorInicial <= 0 &&
        aporte <= 0
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


    // ==========================================
    // TOTAL INVESTIDO
    // ==========================================

    const totalInvestido =
        valorInicial +
        aporte * meses;


    // ==========================================
    // POUPANÇA
    // Simplificação:
    // 70% da Selic
    // ==========================================

    const taxaPoupanca =
        comparadorSelicAtual *
        0.70;


    const poupancaBruto =
        simularComparador(
            valorInicial,
            aporte,
            meses,
            taxaPoupanca
        );


    const poupancaFinal =
        poupancaBruto;


    const poupancaRendimento =
        Math.max(
            poupancaFinal -
            totalInvestido,
            0
        );


    // ==========================================
    // CDI
    // ==========================================

    const cdiBruto =
        simularComparador(
            valorInicial,
            aporte,
            meses,
            comparadorCdiAtual
        );


    const cdiRendimentoBruto =
        Math.max(
            cdiBruto -
            totalInvestido,
            0
        );


    const aliquota =
        obterAliquotaComparador(
            meses
        );


    const cdiIr =
        cdiRendimentoBruto *
        aliquota / 100;


    const cdiFinal =
        cdiBruto -
        cdiIr;


    const cdiRendimentoLiquido =
        Math.max(
            cdiFinal -
            totalInvestido,
            0
        );


    // ==========================================
    // TESOURO SELIC
    // ==========================================

    const selicBruto =
        simularComparador(
            valorInicial,
            aporte,
            meses,
            comparadorSelicAtual
        );


    const selicRendimentoBruto =
        Math.max(
            selicBruto -
            totalInvestido,
            0
        );


    const selicIr =
        selicRendimentoBruto *
        aliquota / 100;


    const selicFinal =
        selicBruto -
        selicIr;


    const selicRendimentoLiquido =
        Math.max(
            selicFinal -
            totalInvestido,
            0
        );


    // ==========================================
    // RESULTADOS
    // ==========================================

    atualizarComparador(
        "comparadorPoupancaFinal",
        formatarMoedaComparador(
            poupancaFinal
        )
    );


    atualizarComparador(
        "comparadorPoupancaRendimento",
        formatarMoedaComparador(
            poupancaRendimento
        )
    );


    atualizarComparador(
        "comparadorCdiFinal",
        formatarMoedaComparador(
            cdiFinal
        )
    );


    atualizarComparador(
        "comparadorCdiRendimento",
        formatarMoedaComparador(
            cdiRendimentoLiquido
        )
    );


    atualizarComparador(
        "comparadorSelicFinal",
        formatarMoedaComparador(
            selicFinal
        )
    );


    atualizarComparador(
        "comparadorSelicRendimento",
        formatarMoedaComparador(
            selicRendimentoLiquido
        )
    );


    // ==========================================
    // MELHOR RESULTADO
    // ==========================================

    const resultados = [

        {
            nome: "Poupança",
            valor: poupancaFinal
        },

        {
            nome: "100% do CDI",
            valor: cdiFinal
        },

        {
            nome: "Tesouro Selic",
            valor: selicFinal
        }

    ];


    resultados.sort(
        (a, b) =>
            b.valor -
            a.valor
    );


    const melhor =
        resultados[0];


    const pior =
        resultados[
            resultados.length - 1
        ];


    const diferenca =
        melhor.valor -
        pior.valor;


    atualizarComparador(
        "comparadorMelhor",
        melhor.nome
    );


    atualizarComparador(
        "comparadorDiferenca",
        formatarMoedaComparador(
            diferenca
        )
    );


    console.log(
        "📊 Comparação concluída:",
        {
            totalInvestido,
            poupancaFinal,
            cdiFinal,
            selicFinal,
            melhor: melhor.nome,
            diferenca
        }
    );

}


// ==========================================
// ATUALIZAR
// ==========================================

function atualizarComparador(
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

function limparComparador() {

    const valor =
        document.getElementById(
            "comparadorValorInicial"
        );


    const aporte =
        document.getElementById(
            "comparadorAporte"
        );


    const meses =
        document.getElementById(
            "comparadorMeses"
        );


    const unidadePrazo =
        document.getElementById(
            "comparadorUnidadePrazo"
        );


    if (valor) {

        valor.value = "";

    }


    if (aporte) {

        aporte.value = "";

    }


    if (meses) {

        meses.value = "";

    }


    if (unidadePrazo) {

        unidadePrazo.value =
            "meses";

    }


    atualizarComparador(
        "comparadorPoupancaFinal",
        "R$ 0,00"
    );


    atualizarComparador(
        "comparadorPoupancaRendimento",
        "R$ 0,00"
    );


    atualizarComparador(
        "comparadorCdiFinal",
        "R$ 0,00"
    );


    atualizarComparador(
        "comparadorCdiRendimento",
        "R$ 0,00"
    );


    atualizarComparador(
        "comparadorSelicFinal",
        "R$ 0,00"
    );


    atualizarComparador(
        "comparadorSelicRendimento",
        "R$ 0,00"
    );


    atualizarComparador(
        "comparadorMelhor",
        "--"
    );


    atualizarComparador(
        "comparadorDiferenca",
        "R$ 0,00"
    );

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        prepararCamposMonetariosComparador();

        carregarTaxasComparador();

    }
);


console.log(
    "📊 Comparador de Investimentos carregado!"
);