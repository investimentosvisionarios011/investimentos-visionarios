// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// INDICADORES ECONÔMICOS
// ==========================================

async function carregarIndicadoresEconomicos() {

    console.log(
        "🇧🇷 Carregando indicadores econômicos..."
    );

    try {

        const resposta =
            await fetch("/api/indicadores");


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "📊 Indicadores recebidos:",
            dados
        );


        // ==========================================
        // ELEMENTOS
        // ==========================================

        const indicadorSelic =
            document.getElementById(
                "indicadorSelic"
            );

            const dashboardSelic =
    document.getElementById(
        "dashboardSelic"
    );

        const indicadorCdi =
            document.getElementById(
                "indicadorCdi"
            );

        const indicadorIpca =
            document.getElementById(
                "indicadorIpca"
            );

        const indicadorIgpm =
            document.getElementById(
                "indicadorIgpm"
            );

        const atualizado =
            document.getElementById(
                "indicadoresAtualizacao"
            );


        // ==========================================
        // SELIC
        // ==========================================

        const selic =
            Number(
                dados?.selic?.valor
            );


        if (
            indicadorSelic &&
            Number.isFinite(selic)
        ) {

            indicadorSelic.textContent =
                selic
                    .toFixed(2)
                    .replace(".", ",")
                + "%";

        }

        if (
    dashboardSelic &&
    Number.isFinite(selic)
) {

    dashboardSelic.textContent =
        selic
            .toFixed(2)
            .replace(".", ",")
        + "%";

}

const barraSelic =
    document.getElementById(
        "selic"
    );


if (
    barraSelic &&
    Number.isFinite(selic)
) {

    barraSelic.textContent =
        selic
            .toFixed(2)
            .replace(".", ",")
        + "%";

}


        // ==========================================
        // IPCA
        // ==========================================

        const ipca =
            Number(
                dados?.ipca?.valor12Meses
            );


        if (
            indicadorIpca &&
            Number.isFinite(ipca)
        ) {

            indicadorIpca.textContent =
                ipca
                    .toFixed(2)
                    .replace(".", ",")
                + "%";

        }

        // ==========================================
// JURO REAL
// ==========================================

const indicadorJuroReal =
    document.getElementById(
        "indicadorJuroReal"
    );


if (
    indicadorJuroReal &&
    Number.isFinite(selic) &&
    Number.isFinite(ipca)
) {

    const juroReal =
        (
            (
                1 + selic / 100
            )
            /
            (
                1 + ipca / 100
            )
            - 1
        ) * 100;


    indicadorJuroReal.textContent =
        juroReal
            .toFixed(2)
            .replace(".", ",")
        + "%";


    indicadorJuroReal.style.color =
        juroReal >= 0
            ? "#16c45b"
            : "#ff4d4d";

}


        // ==========================================
// CDI
// ==========================================

const cdi =
    Number(
        dados?.cdi?.valorAnual
    );


if (
    indicadorCdi &&
    Number.isFinite(cdi)
) {

    indicadorCdi.textContent =
        cdi
            .toFixed(2)
            .replace(".", ",")
        + "%";

}


// ==========================================
// IGP-M
// ==========================================

const igpm =
    Number(
        dados?.igpm?.valor12Meses
    );


if (
    indicadorIgpm &&
    Number.isFinite(igpm)
) {

    indicadorIgpm.textContent =
        igpm
            .toFixed(2)
            .replace(".", ",")
        + "%";

}


        // ==========================================
        // DATA DA ATUALIZAÇÃO
        // ==========================================

        if (
            atualizado &&
            dados.atualizadoEm
        ) {

            const data =
                new Date(
                    dados.atualizadoEm
                );


            atualizado.textContent =
                data.toLocaleString(
                    "pt-BR",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }


        console.log(
            "✅ Indicadores econômicos atualizados!"
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar indicadores econômicos:",
            erro
        );


        const atualizado =
            document.getElementById(
                "indicadoresAtualizacao"
            );


        if (atualizado) {

            atualizado.textContent =
                "Indisponível";

        }

    }

}


// ==========================================
// INICIAR
// ==========================================

console.log(
    "🇧🇷 Arquivo economic-indicators.js carregado!"
);


document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarIndicadoresEconomicos();

    }
);