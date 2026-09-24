let grafico = null;


// ==========================================
// FORMATAÇÃO DE MOEDA
// ==========================================

function formatarMoeda(valor) {

    if (valor === "" || valor === null || valor === undefined) {
        return "";
    }

    let numero = Number(valor);

    if (isNaN(numero)) {
        return "";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// ==========================================
// CONVERTE CAMPO DE MOEDA PARA NÚMERO
// ==========================================

function obterValorNumerico(valor) {

    if (!valor) {
        return 0;
    }

    let texto = valor
        .toString()
        .replace(/R\$/gi, "")
        .replace(/\s/g, "");

    if (texto.includes(",")) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    } else {

        texto = texto.replace(/[^\d.-]/g, "");

    }

    let numero = parseFloat(texto);

    return isNaN(numero) ? 0 : numero;
}


// ==========================================
// PREPARA CAMPOS MONETÁRIOS
// ==========================================

function prepararCamposMonetarios() {

    const campos = [
        document.getElementById("valorInicial"),
        document.getElementById("aporteMensal")
    ];

    campos.forEach(campo => {

        if (!campo) {
            return;
        }

        campo.type = "text";
        campo.inputMode = "decimal";

        campo.addEventListener("focus", function () {

            const numero = obterValorNumerico(this.value);

            if (numero > 0) {

                this.value = numero
                    .toFixed(2)
                    .replace(".", ",");

            }

        });

        campo.addEventListener("blur", function () {

            const numero = obterValorNumerico(this.value);

            if (numero > 0) {

                this.value = formatarMoeda(numero);

            } else {

                this.value = "";

            }

        });

    });
}


// ==========================================
// CONVERSÃO DE TAXAS
// ==========================================

function converterTaxaAnualParaMensal(taxaAnual) {

    return Math.pow(
        1 + taxaAnual,
        1 / 12
    ) - 1;

}


function converterTaxaMensalParaAnual(taxaMensal) {

    return Math.pow(
        1 + taxaMensal,
        12
    ) - 1;

}


// ==========================================
// OBTÉM A TAXA MENSAL
// ==========================================

function obterTaxaMensal() {

    const taxaInformada =
        parseFloat(
            document.getElementById("taxa").value
        ) || 0;

    const unidade =
        document.getElementById("unidadeTaxa")?.value || "mensal";

    const taxaDecimal =
        taxaInformada / 100;

    if (unidade === "anual") {

        return converterTaxaAnualParaMensal(
            taxaDecimal
        );

    }

    return taxaDecimal;
}


// ==========================================
// OBTÉM O PRAZO EM MESES
// ==========================================

function obterPrazoEmMeses() {

    const prazo =
        parseFloat(
            document.getElementById("meses").value
        ) || 0;

    const unidade =
        document.getElementById("unidadePrazo")?.value || "meses";

    if (unidade === "anos") {

        return Math.round(prazo * 12);

    }

    return Math.round(prazo);
}


// ==========================================
// CALCULADORA DE JUROS COMPOSTOS
// ==========================================

function calcular() {

    const valorInicial =
        obterValorNumerico(
            document.getElementById("valorInicial").value
        );

    const aporte =
        obterValorNumerico(
            document.getElementById("aporteMensal").value
        );

    const taxaMensal =
        obterTaxaMensal();

    const meses =
        obterPrazoEmMeses();


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (valorInicial < 0) {

        alert("O valor inicial não pode ser negativo.");
        return;

    }

    if (aporte < 0) {

        alert("O aporte mensal não pode ser negativo.");
        return;

    }

    if (taxaMensal < 0) {

        alert("A taxa não pode ser negativa.");
        return;

    }

    if (meses <= 0) {

        alert("Informe um prazo maior que zero.");
        return;

    }


    // ==========================================
    // CÁLCULO
    // ==========================================

    let saldo = valorInicial;

    let investido = valorInicial;

    let labels = [];

    let dados = [];

    let tabela = "";


    for (let i = 1; i <= meses; i++) {

        saldo *= (1 + taxaMensal);

        saldo += aporte;

        investido += aporte;

        labels.push(i);

        dados.push(saldo);


        const jurosAtual =
            saldo - investido;


        tabela += `
            <tr>

                <td>${i}</td>

                <td>
                    ${investido.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </td>

                <td>
                    ${jurosAtual.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </td>

                <td>
                    ${saldo.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </td>

            </tr>
        `;

    }


    // ==========================================
    // RESULTADOS
    // ==========================================

    const juros =
        saldo - investido;


    const rentabilidade =
        investido > 0
            ? (juros / investido) * 100
            : 0;


    const multiplicacao =
        valorInicial > 0
            ? saldo / valorInicial
            : 0;


    document.getElementById(
        "investido"
    ).innerHTML =
        investido.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });


    document.getElementById(
        "juros"
    ).innerHTML =
        juros.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });


    document.getElementById(
        "total"
    ).innerHTML =
        saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });


    document.getElementById(
        "aporteResultado"
    ).innerHTML =
        aporte.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });


    document.getElementById(
        "rentabilidadeResultado"
    ).innerHTML =
        rentabilidade.toFixed(2) + "%";


    document.getElementById(
        "multiplicacaoResultado"
    ).innerHTML =
        multiplicacao.toFixed(2) + "x";


    // ==========================================
    // GRÁFICO
    // ==========================================

    const ctx =
        document.getElementById(
            "graficoPatrimonio"
        );


    if (grafico) {

        grafico.destroy();

    }


    grafico = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Patrimônio",

                data: dados,

                borderWidth: 3,

                tension: 0.3,

                fill: true

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    });


    // ==========================================
    // ATUALIZA TABELA
    // ==========================================

    document.getElementById(
        "tabelaEvolucao"
    ).innerHTML = tabela;

}


// ==========================================
// LIMPAR CAMPOS
// ==========================================

function limparCampos() {

    document.getElementById(
        "valorInicial"
    ).value = "";


    document.getElementById(
        "aporteMensal"
    ).value = "";


    document.getElementById(
        "taxa"
    ).value = "";


    document.getElementById(
        "meses"
    ).value = "";


    const unidadeTaxa =
        document.getElementById("unidadeTaxa");

    if (unidadeTaxa) {

        unidadeTaxa.value = "mensal";

    }


    const unidadePrazo =
        document.getElementById("unidadePrazo");

    if (unidadePrazo) {

        unidadePrazo.value = "meses";

    }


    document.getElementById(
        "investido"
    ).innerHTML = "R$ 0,00";


    document.getElementById(
        "juros"
    ).innerHTML = "R$ 0,00";


    document.getElementById(
        "rentabilidadeResultado"
    ).innerHTML = "0%";


    document.getElementById(
        "multiplicacaoResultado"
    ).innerHTML = "0x";


    document.getElementById(
        "aporteResultado"
    ).innerHTML = "R$ 0,00";


    document.getElementById(
        "total"
    ).innerHTML = "R$ 0,00";


    document.getElementById(
        "tabelaEvolucao"
    ).innerHTML = "";


    if (grafico) {

        grafico.destroy();

        grafico = null;

    }

}


// ==========================================
// CONTADOR ANIMADO
// ==========================================

const counters =
    document.querySelectorAll(".counter");


counters.forEach(counter => {

    const update = () => {

        const target =
            +counter.getAttribute("data-target");

        const current =
            +counter.innerText;

        const increment =
            target / 80;

        if (current < target) {

            counter.innerText =
                Math.ceil(
                    current + increment
                );

            setTimeout(
                update,
                20
            );

        } else {

            counter.innerText =
                target;

        }

    };

    update();

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

prepararCamposMonetarios();