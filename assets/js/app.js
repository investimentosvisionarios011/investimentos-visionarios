let grafico = null;

function calcular() {

    let valorInicial = parseFloat(document.getElementById("valorInicial").value) || 0;
    let aporte = parseFloat(document.getElementById("aporteMensal").value) || 0;
    let taxa = (parseFloat(document.getElementById("taxa").value) || 0) / 100;
    let meses = parseInt(document.getElementById("meses").value) || 0;

    let saldo = valorInicial;
    let investido = valorInicial;

    let labels = [];
    let dados = [];
    let tabela = "";

    for (let i = 1; i <= meses; i++) {

        saldo *= (1 + taxa);
        saldo += aporte;
        investido += aporte;

        labels.push(i);
        dados.push(saldo);
        let jurosAtual = saldo - investido;

tabela += `
<tr>

<td>${i}</td>

<td>${investido.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>

<td>${jurosAtual.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>

<td>${saldo.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>

</tr>
`;

    }

    let juros = saldo - investido;

    let rentabilidade = investido > 0
    ? (juros / investido) * 100
    : 0;

let multiplicacao = valorInicial > 0
    ? saldo / valorInicial
    : 0;

document.getElementById("rentabilidadeResultado").innerHTML="0%";

document.getElementById("multiplicacaoResultado").innerHTML="0x";

document.getElementById("aporteResultado").innerHTML="R$ 0,00";

    document.getElementById("investido").innerHTML =
        investido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    document.getElementById("juros").innerHTML =
        juros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    document.getElementById("total").innerHTML =
        saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

        document.getElementById("aporteResultado").innerHTML =
    aporte.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

document.getElementById("rentabilidadeResultado").innerHTML =
    rentabilidade.toFixed(2) + "%";

document.getElementById("multiplicacaoResultado").innerHTML =
    multiplicacao.toFixed(2) + "x";

    const ctx = document.getElementById("graficoPatrimonio");

    if (grafico) {
        grafico.destroy();
    }

      grafico = new Chart(ctx, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [{

                label: 'Patrimônio',

                data: dados,

                borderWidth: 3,

                tension: .3,

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

    // Atualiza a tabela
    document.getElementById("tabelaEvolucao").innerHTML = tabela;

}

function limparCampos(){

document.getElementById("valorInicial").value="";
document.getElementById("aporteMensal").value="";
document.getElementById("taxa").value="";
document.getElementById("meses").value="";

document.getElementById("investido").innerHTML="R$ 0,00";
document.getElementById("juros").innerHTML="R$ 0,00";
document.getElementById("rentabilidade").innerHTML="0%";
document.getElementById("total").innerHTML="R$ 0,00";

document.getElementById("tabelaEvolucao").innerHTML="";

if(grafico){
grafico.destroy();
grafico=null;
}

}

//===============================
// CONTADOR ANIMADO
//===============================

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const update = () => {

        const target = +counter.getAttribute("data-target");

        const current = +counter.innerText;

        const increment = target / 80;

        if (current < target) {

            counter.innerText = Math.ceil(current + increment);

            setTimeout(update, 20);

        } else {

            counter.innerText = target;

        }

    };

    update();

});