// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// CALCULADORA IPCA
// ==========================================

let taxaIPCAAtual = 0;


// ==========================================
// FORMATAÇÃO DE MOEDA
// ==========================================

function formatarMoedaIPCA(valor) {

    if (!isFinite(valor)) {
        valor = 0;
    }

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ==========================================
// CONVERTER CAMPO MONETÁRIO
// ==========================================

function obterValorNumericoIPCA(valor) {

    if (typeof valor === "number") {
        return valor;
    }

    if (!valor) {
        return 0;
    }

    let texto = String(valor).trim();

    texto = texto
        .replace(/R\$/gi, "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    const numero = parseFloat(texto);

    return isNaN(numero) ? 0 : numero;

}


// ==========================================
// CONVERTER TAXA DIGITADA
// ==========================================

function obterTaxaNumericaIPCA(valor) {

    if (typeof valor === "number") {
        return isFinite(valor) ? valor : 0;
    }

    if (!valor) {
        return 0;
    }

    let texto = String(valor).trim();

    // Remove espaços
    texto = texto.replace(/\s/g, "");

    // Se houver vírgula, ela é o separador decimal brasileiro
    if (texto.includes(",")) {

        texto = texto.replace(/\./g, "");
        texto = texto.replace(",", ".");

    }

    const numero = parseFloat(texto);

    return isNaN(numero) ? 0 : numero;

}


// ==========================================
// PREPARAR CAMPO MONETÁRIO
// ==========================================

function prepararCamposMonetariosIPCA() {

    const campo =
        document.getElementById(
            "ipcaValorInicial"
        );

    if (!campo) {
        return;
    }

    campo.type = "text";
    campo.inputMode = "decimal";

    campo.addEventListener(
        "focus",
        function () {

            const valor =
                obterValorNumericoIPCA(
                    this.value
                );

            if (valor > 0) {

                this.value =
                    valor
                        .toFixed(2)
                        .replace(".", ",");

            } else {

                this.value = "";

            }

        }
    );

    campo.addEventListener(
        "blur",
        function () {

            const valor =
                obterValorNumericoIPCA(
                    this.value
                );

            if (valor > 0) {

                this.value =
                    formatarMoedaIPCA(
                        valor
                    );

            } else {

                this.value = "";

            }

        }
    );

}


// ==========================================
// CONVERTER TAXA ANUAL PARA MENSAL
// ==========================================

function taxaMensalIPCA(taxaAnual) {

    return (
        Math.pow(
            1 + (taxaAnual / 100),
            1 / 12
        ) - 1
    );

}


// ==========================================
// CONVERTER TAXA MENSAL PARA ANUAL
// ==========================================

function taxaAnualIPCA(taxaMensal) {

    return (
        Math.pow(
            1 + (taxaMensal / 100),
            12
        ) - 1
    ) * 100;

}


// ==========================================
// OBTER RENTABILIDADE ANUAL
// ==========================================

function obterRentabilidadeAnualIPCA() {

    const campo =
        document.getElementById(
            "ipcaRentabilidade"
        );

    const unidade =
        document.getElementById(
            "ipcaUnidadeRentabilidade"
        );

    if (!campo) {
        return 0;
    }

    const taxa =
        obterTaxaNumericaIPCA(
            campo.value
        );

    if (
        unidade &&
        unidade.value === "mensal"
    ) {

        return taxaAnualIPCA(taxa);

    }

    return taxa;

}


// ==========================================
// OBTER RENTABILIDADE MENSAL
// ==========================================

function obterRentabilidadeMensalIPCA() {

    const campo =
        document.getElementById(
            "ipcaRentabilidade"
        );

    const unidade =
        document.getElementById(
            "ipcaUnidadeRentabilidade"
        );

    if (!campo) {
        return 0;
    }

    const taxa =
        obterTaxaNumericaIPCA(
            campo.value
        );

    if (
        unidade &&
        unidade.value === "mensal"
    ) {

        return taxa / 100;

    }

    return taxaMensalIPCA(taxa);

}


// ==========================================
// OBTER PRAZO EM MESES
// ==========================================

function obterPrazoEmMesesIPCA() {

    const campo =
        document.getElementById(
            "ipcaPrazo"
        );

    const unidade =
        document.getElementById(
            "ipcaUnidadePrazo"
        );

    if (!campo) {
        return 0;
    }

    const prazo =
        obterTaxaNumericaIPCA(
            campo.value
        );

    if (
        unidade &&
        unidade.value === "anos"
    ) {

        return Math.round(
            prazo * 12
        );

    }

    return Math.round(prazo);

}


// ==========================================
// CARREGAR IPCA ATUAL
// ==========================================

async function carregarIPCAAtual() {

    try {

        const resposta =
            await fetch(
                "/api/indicadores"
            );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar indicadores."
            );

        }

        const dados =
            await resposta.json();

        taxaIPCAAtual =
            parseFloat(
                dados?.ipca?.valor12Meses
            ) || 0;

        const elemento =
            document.getElementById(
                "ipcaTaxaAtual"
            );

        if (elemento) {

            elemento.textContent =
                taxaIPCAAtual.toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                ) + "%";

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar IPCA:",
            erro
        );

        taxaIPCAAtual = 0;

        const elemento =
            document.getElementById(
                "ipcaTaxaAtual"
            );

        if (elemento) {
            elemento.textContent = "--";
        }

    }

}


// ==========================================
// CALCULAR IPCA
// ==========================================

function calcularIPCA() {

    const valorInicial =
        obterValorNumericoIPCA(
            document.getElementById(
                "ipcaValorInicial"
            )?.value
        );

    const rentabilidadeMensal =
        obterRentabilidadeMensalIPCA();

    const rentabilidadeAnual =
        obterRentabilidadeAnualIPCA();

    const prazoMeses =
        obterPrazoEmMesesIPCA();


    // ======================================
    // VALIDAÇÕES
    // ======================================

    if (
        !valorInicial ||
        valorInicial <= 0
    ) {

        alert(
            "Informe um valor inicial válido."
        );

        return;

    }

    if (
        rentabilidadeMensal < 0
    ) {

        alert(
            "Informe uma rentabilidade válida."
        );

        return;

    }

    if (
        !prazoMeses ||
        prazoMeses <= 0
    ) {

        alert(
            "Informe um prazo válido."
        );

        return;

    }

    if (
        !taxaIPCAAtual ||
        taxaIPCAAtual < 0
    ) {

        alert(
            "Não foi possível obter o IPCA atual."
        );

        return;

    }


    // ======================================
    // IPCA MENSAL
    // ======================================

    const ipcaMensal =
        taxaMensalIPCA(
            taxaIPCAAtual
        );


    // ======================================
    // VALOR FINAL NOMINAL
    // ======================================

    const valorFinalNominal =
        valorInicial *
        Math.pow(
            1 + rentabilidadeMensal,
            prazoMeses
        );


    // ======================================
    // GANHO NOMINAL
    // ======================================

    const ganhoNominal =
        valorFinalNominal -
        valorInicial;


    // ======================================
    // RENTABILIDADE REAL ANUAL
    // ======================================

    const rentabilidadeRealAnual =
        (
            (
                1 +
                rentabilidadeAnual / 100
            ) /
            (
                1 +
                taxaIPCAAtual / 100
            )
            - 1
        ) * 100;


    // ======================================
    // INFLAÇÃO ACUMULADA
    // ======================================

    const inflacaoAcumulada =
        Math.pow(
            1 + ipcaMensal,
            prazoMeses
        );


    // ======================================
    // VALOR REAL
    // ======================================

    const valorReal =
        valorFinalNominal /
        inflacaoAcumulada;


    // ======================================
    // ATUALIZAR RESULTADOS
    // ======================================

    const resultadoInicial =
        document.getElementById(
            "ipcaValorInicialResultado"
        );

    const resultadoFinal =
        document.getElementById(
            "ipcaValorFinalNominal"
        );

    const resultadoGanho =
        document.getElementById(
            "ipcaGanhoNominal"
        );

    const resultadoRentabilidadeReal =
        document.getElementById(
            "ipcaRentabilidadeReal"
        );

    const resultadoValorReal =
        document.getElementById(
            "ipcaValorReal"
        );


    if (resultadoInicial) {

        resultadoInicial.textContent =
            formatarMoedaIPCA(
                valorInicial
            );

    }


    if (resultadoFinal) {

        resultadoFinal.textContent =
            formatarMoedaIPCA(
                valorFinalNominal
            );

    }


    if (resultadoGanho) {

        resultadoGanho.textContent =
            formatarMoedaIPCA(
                ganhoNominal
            );

    }


    if (resultadoRentabilidadeReal) {

        resultadoRentabilidadeReal.textContent =
            rentabilidadeRealAnual.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ) + "% a.a.";

    }


    if (resultadoValorReal) {

        resultadoValorReal.textContent =
            formatarMoedaIPCA(
                valorReal
            );

    }

}


// ==========================================
// LIMPAR CALCULADORA
// ==========================================

function limparIPCA() {

    const valorInicial =
        document.getElementById(
            "ipcaValorInicial"
        );

    const rentabilidade =
        document.getElementById(
            "ipcaRentabilidade"
        );

    const prazo =
        document.getElementById(
            "ipcaPrazo"
        );

    const unidadeRentabilidade =
        document.getElementById(
            "ipcaUnidadeRentabilidade"
        );

    const unidadePrazo =
        document.getElementById(
            "ipcaUnidadePrazo"
        );


    if (valorInicial) {
        valorInicial.value = "";
    }

    if (rentabilidade) {
        rentabilidade.value = "";
    }

    if (prazo) {
        prazo.value = "";
    }

    if (unidadeRentabilidade) {
        unidadeRentabilidade.value =
            "anual";
    }

    if (unidadePrazo) {
        unidadePrazo.value =
            "anos";
    }


    const resultadoInicial =
        document.getElementById(
            "ipcaValorInicialResultado"
        );

    const resultadoFinal =
        document.getElementById(
            "ipcaValorFinalNominal"
        );

    const resultadoGanho =
        document.getElementById(
            "ipcaGanhoNominal"
        );

    const resultadoRentabilidadeReal =
        document.getElementById(
            "ipcaRentabilidadeReal"
        );

    const resultadoValorReal =
        document.getElementById(
            "ipcaValorReal"
        );


    if (resultadoInicial) {
        resultadoInicial.textContent =
            "R$ 0,00";
    }

    if (resultadoFinal) {
        resultadoFinal.textContent =
            "R$ 0,00";
    }

    if (resultadoGanho) {
        resultadoGanho.textContent =
            "R$ 0,00";
    }

    if (resultadoRentabilidadeReal) {
        resultadoRentabilidadeReal.textContent =
            "0%";
    }

    if (resultadoValorReal) {
        resultadoValorReal.textContent =
            "R$ 0,00";
    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        prepararCamposMonetariosIPCA();

        carregarIPCAAtual();

    }
);