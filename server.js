// ==========================================
// INVESTIMENTOS VISIONÁRIOS
// BACKEND
// ==========================================

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.use(express.json());


// ==========================================
// SERVIR O SITE
// ==========================================

app.use(express.static(__dirname));


// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// ==========================================
// TESTE DO SERVIDOR
// ==========================================

app.get("/api/status", (req, res) => {

    res.json({

        status: "online",

        projeto: "Investimentos Visionários",

        mensagem: "Backend funcionando!"

    });

});


// ==========================================
// TESTE DA CHAVE
// ==========================================

app.get("/api/config-status", (req, res) => {

    res.json({

        bolsaiConfigurada:
            Boolean(process.env.BOLSAI_API_KEY)

    });

});

// ==========================================
// IBOVESPA - YAHOO FINANCE
// ==========================================

app.get("/api/ibovespa", async (req, res) => {

    try {

        const url =
            "https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?interval=1d&range=1d";

        const resposta = await fetch(url, {

            headers: {

                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",

                "Accept":
                    "application/json"

            }

        });

        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error(
                "Erro Yahoo Finance:",
                resposta.status,
                erro
            );

            return res.status(resposta.status).json({

                erro: "Erro ao consultar Yahoo Finance",

                status: resposta.status,

                detalhes: erro

            });

        }

        const dados = await resposta.json();

        const resultado =
            dados?.chart?.result?.[0];

        if (!resultado) {

            return res.status(404).json({

                erro: "Dados do Ibovespa não encontrados."

            });

        }

        const meta = resultado.meta;

        const preco =
            meta?.regularMarketPrice;

        const fechamentoAnterior =
            meta?.previousClose ??
            meta?.chartPreviousClose;

        let variacao = 0;

        if (
            typeof preco === "number" &&
            typeof fechamentoAnterior === "number" &&
            fechamentoAnterior !== 0
        ) {

            variacao =
                ((preco - fechamentoAnterior) /
                    fechamentoAnterior) * 100;

        }

        const respostaFinal = {

            simbolo: "^BVSP",

            nome: "IBOVESPA",

            preco: preco,

            fechamentoAnterior:
                fechamentoAnterior,

            variacao:
                variacao,

            moeda:
                meta?.currency || "BRL",

            mercado:
                meta?.exchangeName || "B3"

        };

        console.log(
            "Ibovespa recebido:",
            respostaFinal
        );

        res.json(respostaFinal);

    } catch (erro) {

        console.error(
            "Erro ao buscar Ibovespa:",
            erro
        );

        res.status(500).json({

            erro:
                "Falha ao buscar Ibovespa.",

            detalhes:
                erro.message

        });

    }

});

// ==========================================
// HISTÓRICO DO IBOVESPA - YAHOO FINANCE
// ==========================================

app.get("/api/ibovespa/historico", async (req, res) => {

    try {

        // Período recebido do navegador
        const periodo = req.query.periodo || "1mo";

        // Períodos permitidos
        const periodosPermitidos = [
            "5d",
            "1mo",
            "6mo",
            "1y"
        ];

        if (!periodosPermitidos.includes(periodo)) {

            return res.status(400).json({
                erro: "Período inválido."
            });

        }

        // Define intervalo adequado
        let intervalo = "1d";

        if (periodo === "5d") {
            intervalo = "1h";
        }

        const url =
            `https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?interval=${intervalo}&range=${periodo}`;


        const resposta = await fetch(url, {

            headers: {

                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

                "Accept":
                    "application/json"

            }

        });


        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error(
                "Erro Yahoo histórico:",
                resposta.status,
                erro
            );

            return res.status(resposta.status).json({

                erro: "Erro ao consultar histórico do Ibovespa."

            });

        }


        const dados = await resposta.json();

        const resultado =
            dados?.chart?.result?.[0];


        if (!resultado) {

            return res.status(404).json({

                erro:
                    "Histórico do Ibovespa não encontrado."

            });

        }


        const timestamps =
            resultado.timestamp || [];

        const fechamentos =
            resultado.indicators?.quote?.[0]?.close || [];


        const historico = [];


        for (let i = 0; i < timestamps.length; i++) {

            const preco =
                Number(fechamentos[i]);


            if (!Number.isFinite(preco)) {
                continue;
            }


            historico.push({

                data:
                    timestamps[i] * 1000,

                preco:
                    preco

            });

        }


        res.json({

            simbolo: "^BVSP",

            periodo: periodo,

            intervalo: intervalo,

            pontos: historico

        });


    } catch (erro) {

        console.error(
            "Erro ao buscar histórico do Ibovespa:",
            erro
        );


        res.status(500).json({

            erro:
                "Falha ao buscar histórico do Ibovespa.",

            detalhes:
                erro.message

        });

    }

});

// ==========================================
// HISTÓRICO DO DÓLAR - YAHOO FINANCE
// ==========================================

app.get("/api/dolar/historico", async (req, res) => {

    try {

        const periodo = req.query.periodo || "1mo";

        const periodosPermitidos = [
            "5d",
            "1mo",
            "6mo",
            "1y"
        ];

        if (!periodosPermitidos.includes(periodo)) {

            return res.status(400).json({
                erro: "Período inválido."
            });

        }

        let intervalo = "1d";

        if (periodo === "5d") {
            intervalo = "1h";
        }

        const url =
            `https://query1.finance.yahoo.com/v8/finance/chart/USDBRL%3DX?interval=${intervalo}&range=${periodo}`;

        const resposta = await fetch(url, {

            headers: {

                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

                "Accept":
                    "application/json"
            }

        });

        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error(
                "Erro Yahoo dólar:",
                resposta.status,
                erro
            );

            return res.status(resposta.status).json({
                erro: "Erro ao consultar histórico do dólar."
            });

        }

        const dados = await resposta.json();

        const resultado =
            dados?.chart?.result?.[0];

        if (!resultado) {

            return res.status(404).json({
                erro: "Histórico do dólar não encontrado."
            });

        }

        const timestamps =
            resultado.timestamp || [];

        const fechamentos =
            resultado.indicators?.quote?.[0]?.close || [];

        const historico = [];

        for (let i = 0; i < timestamps.length; i++) {

            const preco =
                Number(fechamentos[i]);

            if (!Number.isFinite(preco)) {
                continue;
            }

            historico.push({

                data:
                    timestamps[i] * 1000,

                preco:
                    preco

            });

        }

        res.json({

            simbolo: "USDBRL=X",

            periodo: periodo,

            intervalo: intervalo,

            pontos: historico

        });

    } catch (erro) {

        console.error(
            "Erro ao buscar histórico do dólar:",
            erro
        );

        res.status(500).json({

            erro:
                "Falha ao buscar histórico do dólar.",

            detalhes:
                erro.message

        });

    }

});

// ==========================================
// HISTÓRICO DO BITCOIN EM REAIS
// YAHOO FINANCE
// ==========================================

app.get("/api/bitcoin/historico", async (req, res) => {

    try {

        const periodo = req.query.periodo || "1mo";

        const periodosPermitidos = [
            "5d",
            "1mo",
            "6mo",
            "1y"
        ];

        if (!periodosPermitidos.includes(periodo)) {

            return res.status(400).json({
                erro: "Período inválido."
            });

        }


        // ==========================================
        // INTERVALO
        // ==========================================

        let intervalo = "1d";

        if (periodo === "5d") {
            intervalo = "1h";
        }


        // ==========================================
        // URLs
        // ==========================================

        const urlBitcoin =
            `https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?interval=${intervalo}&range=${periodo}`;

        const urlDolar =
            `https://query1.finance.yahoo.com/v8/finance/chart/USDBRL%3DX?interval=${intervalo}&range=${periodo}`;


        const headers = {

            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

            "Accept":
                "application/json"

        };


        // ==========================================
        // BUSCAR BTC E DÓLAR
        // ==========================================

        const [
            respostaBitcoin,
            respostaDolar
        ] = await Promise.all([

            fetch(urlBitcoin, { headers }),

            fetch(urlDolar, { headers })

        ]);


        if (!respostaBitcoin.ok) {

            throw new Error(
                `Erro Bitcoin HTTP ${respostaBitcoin.status}`
            );

        }


        if (!respostaDolar.ok) {

            throw new Error(
                `Erro Dólar HTTP ${respostaDolar.status}`
            );

        }


        const dadosBitcoin =
            await respostaBitcoin.json();

        const dadosDolar =
            await respostaDolar.json();


        const resultadoBitcoin =
            dadosBitcoin?.chart?.result?.[0];

        const resultadoDolar =
            dadosDolar?.chart?.result?.[0];


        if (!resultadoBitcoin) {

            throw new Error(
                "Histórico do Bitcoin não encontrado."
            );

        }


        if (!resultadoDolar) {

            throw new Error(
                "Histórico do dólar não encontrado."
            );

        }


        // ==========================================
        // DADOS BTC
        // ==========================================

        const timestampsBitcoin =
            resultadoBitcoin.timestamp || [];

        const fechamentosBitcoin =
            resultadoBitcoin
                .indicators
                ?.quote?.[0]
                ?.close || [];


        // ==========================================
        // DADOS DO DÓLAR
        // ==========================================

        const timestampsDolar =
            resultadoDolar.timestamp || [];

        const fechamentosDolar =
            resultadoDolar
                .indicators
                ?.quote?.[0]
                ?.close || [];


        // ==========================================
        // ORGANIZAR COTAÇÕES DO DÓLAR
        // ==========================================

        const cotacoesDolar = [];


        for (
            let i = 0;
            i < timestampsDolar.length;
            i++
        ) {

            const timestamp =
                Number(timestampsDolar[i]);

            const preco =
                Number(fechamentosDolar[i]);


            if (
                Number.isFinite(timestamp) &&
                Number.isFinite(preco) &&
                preco > 0
            ) {

                cotacoesDolar.push({

                    timestamp: timestamp,

                    preco: preco

                });

            }

        }


        if (cotacoesDolar.length === 0) {

            throw new Error(
                "Nenhuma cotação válida do dólar encontrada."
            );

        }


        // ==========================================
        // FUNÇÃO PARA BUSCAR DÓLAR MAIS PRÓXIMO
        // ==========================================

        function encontrarDolar(timestampBitcoin) {

            let melhorCotacao = null;


            for (
                let i = 0;
                i < cotacoesDolar.length;
                i++
            ) {

                const item =
                    cotacoesDolar[i];


                // Só usamos cotação anterior
                // ou igual ao horário do Bitcoin

                if (
                    item.timestamp <= timestampBitcoin
                ) {

                    melhorCotacao =
                        item.preco;

                } else {

                    break;

                }

            }


            // Se ainda não encontrou,
            // usa a primeira cotação disponível

            if (!Number.isFinite(melhorCotacao)) {

                melhorCotacao =
                    cotacoesDolar[0].preco;

            }


            return melhorCotacao;

        }


        // ==========================================
        // CONVERTER BTC/USD PARA BTC/BRL
        // ==========================================

        const historico = [];


        for (
            let i = 0;
            i < timestampsBitcoin.length;
            i++
        ) {

            const timestamp =
                Number(timestampsBitcoin[i]);

            const bitcoinUsd =
                Number(fechamentosBitcoin[i]);


            if (
                !Number.isFinite(timestamp) ||
                !Number.isFinite(bitcoinUsd) ||
                bitcoinUsd <= 0
            ) {

                continue;

            }


            const dolar =
                encontrarDolar(timestamp);


            if (
                !Number.isFinite(dolar) ||
                dolar <= 0
            ) {

                continue;

            }


            const bitcoinBrl =
                bitcoinUsd * dolar;


            if (
                !Number.isFinite(bitcoinBrl) ||
                bitcoinBrl <= 0
            ) {

                continue;

            }


            historico.push({

                data:
                    timestamp * 1000,

                preco:
                    bitcoinBrl

            });

        }


        // ==========================================
        // VERIFICAR RESULTADO
        // ==========================================

        if (historico.length === 0) {

            throw new Error(
                "Nenhum ponto histórico válido foi gerado."
            );

        }


        console.log(
            `Bitcoin: ${historico.length} pontos históricos gerados.`
        );


        // ==========================================
        // RESPOSTA
        // ==========================================

        res.json({

            simbolo:
                "BTC-BRL",

            fonteBitcoin:
                "BTC-USD",

            conversao:
                "USD/BRL",

            periodo:
                periodo,

            intervalo:
                intervalo,

            pontos:
                historico

        });


    } catch (erro) {

        console.error(
            "Erro ao buscar histórico do Bitcoin:",
            erro
        );


        res.status(500).json({

            erro:
                "Falha ao buscar histórico do Bitcoin.",

            detalhes:
                erro.message

        });

    }

});

// ==========================================
// INDICADORES ECONÔMICOS
// BANCO CENTRAL DO BRASIL
// ==========================================

app.get("/api/indicadores", async (req, res) => {

    try {

        console.log(
            "🇧🇷 Buscando indicadores econômicos..."
        );


        // ==========================================
        // URLs DO BANCO CENTRAL
        // ==========================================

        // Meta Selic - SGS 432
        const urlSelic =
            "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json";


        // CDI diário - SGS 12
        const urlCdi =
            "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/10?formato=json";


        // IPCA mensal - SGS 433
        const urlIpca =
            "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/14?formato=json";


        // IGP-M mensal - SGS 189
        const urlIgpm =
            "https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos/14?formato=json";


        // ==========================================
        // BUSCAR DADOS
        // ==========================================

        const [
            respostaSelic,
            respostaCdi,
            respostaIpca,
            respostaIgpm
        ] = await Promise.all([

            fetch(urlSelic),

            fetch(urlCdi),

            fetch(urlIpca),

            fetch(urlIgpm)

        ]);


        // ==========================================
        // VALIDAR RESPOSTAS
        // ==========================================

        if (!respostaSelic.ok) {

            throw new Error(
                `Erro ao buscar Selic: HTTP ${respostaSelic.status}`
            );

        }


        if (!respostaCdi.ok) {

            throw new Error(
                `Erro ao buscar CDI: HTTP ${respostaCdi.status}`
            );

        }


        if (!respostaIpca.ok) {

            throw new Error(
                `Erro ao buscar IPCA: HTTP ${respostaIpca.status}`
            );

        }


        if (!respostaIgpm.ok) {

            throw new Error(
                `Erro ao buscar IGP-M: HTTP ${respostaIgpm.status}`
            );

        }


        // ==========================================
        // JSON
        // ==========================================

        const dadosSelic =
            await respostaSelic.json();


        const dadosCdi =
            await respostaCdi.json();


        const dadosIpca =
            await respostaIpca.json();


        const dadosIgpm =
            await respostaIgpm.json();


        // ==========================================
        // SELIC
        // ==========================================

        const ultimoSelic =
            dadosSelic[
                dadosSelic.length - 1
            ];


        const selic =
            Number(
                String(
                    ultimoSelic?.valor
                ).replace(",", ".")
            );


        if (!Number.isFinite(selic)) {

            throw new Error(
                "Valor da Selic inválido."
            );

        }


        // ==========================================
        // CDI
        // ==========================================

        const cdiValidos =
            dadosCdi
                .map(item => {

                    return {

                        data:
                            item.data,

                        valor:
                            Number(
                                String(
                                    item.valor
                                ).replace(",", ".")
                            )

                    };

                })
                .filter(item => {

                    return Number.isFinite(
                        item.valor
                    );

                });


        if (cdiValidos.length === 0) {

            throw new Error(
                "Nenhum valor válido de CDI encontrado."
            );

        }


        const ultimoCdi =
            cdiValidos[
                cdiValidos.length - 1
            ];


        /*
        A série diária do CDI representa a taxa diária.
        Para mostrar uma taxa anual equivalente,
        anualizamos com base em 252 dias úteis.
        */

        const cdiDiario =
            ultimoCdi.valor;


        const cdiAnual =
            (
                Math.pow(
                    1 + cdiDiario / 100,
                    252
                ) - 1
            ) * 100;


        // ==========================================
        // FUNÇÃO PARA ACUMULAR 12 MESES
        // ==========================================

        function calcularAcumulado12Meses(
            dados
        ) {

            const valoresValidos =
                dados
                    .map(item => {

                        return {

                            data:
                                item.data,

                            valor:
                                Number(
                                    String(
                                        item.valor
                                    ).replace(",", ".")
                                )

                        };

                    })
                    .filter(item => {

                        return Number.isFinite(
                            item.valor
                        );

                    })
                    .slice(-12);


            if (
                valoresValidos.length < 12
            ) {

                throw new Error(
                    "Não há 12 meses válidos disponíveis."
                );

            }


            let fator = 1;


            valoresValidos.forEach(item => {

                fator *=
                    (
                        1 +
                        item.valor / 100
                    );

            });


            return {

                valor:
                    (
                        fator - 1
                    ) * 100,

                referencia:
                    valoresValidos[
                        valoresValidos.length - 1
                    ]?.data || null

            };

        }


        // ==========================================
        // IPCA 12 MESES
        // ==========================================

        const ipca12 =
            calcularAcumulado12Meses(
                dadosIpca
            );


        // ==========================================
        // IGP-M 12 MESES
        // ==========================================

        const igpm12 =
            calcularAcumulado12Meses(
                dadosIgpm
            );


        // ==========================================
        // RESPOSTA
        // ==========================================

        const indicadores = {

            selic: {

                valor:
                    selic,

                unidade:
                    "% a.a.",

                referencia:
                    ultimoSelic?.data || null,

                fonte:
                    "Banco Central do Brasil",

                serie:
                    432

            },


            cdi: {

                valorDiario:
                    cdiDiario,

                valorAnual:
                    cdiAnual,

                unidade:
                    "% a.a.",

                referencia:
                    ultimoCdi?.data || null,

                fonte:
                    "Banco Central do Brasil",

                serie:
                    12

            },


            ipca: {

                valor12Meses:
                    ipca12.valor,

                unidade:
                    "%",

                referencia:
                    ipca12.referencia,

                fonte:
                    "Banco Central do Brasil",

                serie:
                    433

            },


            igpm: {

                valor12Meses:
                    igpm12.valor,

                unidade:
                    "%",

                referencia:
                    igpm12.referencia,

                fonte:
                    "Banco Central do Brasil",

                serie:
                    189

            },


            atualizadoEm:
                new Date().toISOString()

        };


        console.log(
            "✅ Indicadores econômicos:",
            indicadores
        );


        res.json(
            indicadores
        );


    } catch (erro) {

        console.error(
            "❌ Erro nos indicadores econômicos:",
            erro
        );


        res.status(500).json({

            erro:
                "Falha ao buscar indicadores econômicos.",

            detalhes:
                erro.message

        });

    }

});

// ==========================================
// HISTÓRICO SELIC X IPCA
// ==========================================

app.get("/api/indicadores/historico", async (req, res) => {

    try {

        const periodo =
            req.query.periodo || "1y";


        const mesesPorPeriodo = {

            "1y": 12,
            "2y": 24,
            "5y": 60

        };


        if (!mesesPorPeriodo[periodo]) {

            return res.status(400).json({

                erro:
                    "Período inválido."

            });

        }


        const quantidadeMeses =
            mesesPorPeriodo[periodo];


        // ==========================================
        // CALCULAR DATAS
        // ==========================================

        const hoje =
            new Date();


        /*
        Precisamos de 12 meses extras
        para calcular o IPCA acumulado.
        */

        const dataInicial =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth() -
                    quantidadeMeses -
                    12,
                1
            );


        const dataFinal =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                hoje.getDate()
            );


        // ==========================================
        // FORMATAR DATA PARA DD/MM/AAAA
        // ==========================================

        function formatarDataBC(data) {

            const dia =
                String(
                    data.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const mes =
                String(
                    data.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const ano =
                data.getFullYear();


            return `${dia}/${mes}/${ano}`;

        }


        const inicio =
            formatarDataBC(
                dataInicial
            );


        const fim =
            formatarDataBC(
                dataFinal
            );


        console.log(
            "📊 Histórico Selic x IPCA:",
            periodo,
            inicio,
            fim
        );


        // ==========================================
        // URLs
        // ==========================================

        const urlSelic =
            "https://api.bcb.gov.br/dados/serie/" +
            "bcdata.sgs.432/dados" +
            `?formato=json` +
            `&dataInicial=${inicio}` +
            `&dataFinal=${fim}`;


        const urlIpca =
            "https://api.bcb.gov.br/dados/serie/" +
            "bcdata.sgs.433/dados" +
            `?formato=json` +
            `&dataInicial=${inicio}` +
            `&dataFinal=${fim}`;


        // ==========================================
        // BUSCAR DADOS
        // ==========================================

        const [
            respostaSelic,
            respostaIpca
        ] = await Promise.all([

            fetch(urlSelic),

            fetch(urlIpca)

        ]);


        // ==========================================
        // VERIFICAR RESPOSTAS
        // ==========================================

        if (!respostaSelic.ok) {

            const texto =
                await respostaSelic.text();


            throw new Error(
                `Erro Selic HTTP ${respostaSelic.status}: ${texto}`
            );

        }


        if (!respostaIpca.ok) {

            const texto =
                await respostaIpca.text();


            throw new Error(
                `Erro IPCA HTTP ${respostaIpca.status}: ${texto}`
            );

        }


        // ==========================================
        // JSON
        // ==========================================

        const dadosSelic =
            await respostaSelic.json();


        const dadosIpca =
            await respostaIpca.json();


        console.log(
            "📈 Registros Selic:",
            dadosSelic.length
        );


        console.log(
            "📉 Registros IPCA:",
            dadosIpca.length
        );


        // ==========================================
        // CONVERTER DATA BR
        // ==========================================

        function parseDataBr(data) {

            const [
                dia,
                mes,
                ano
            ] = data.split("/");


            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            );

        }


        // ==========================================
        // CHAVE ANO-MÊS
        // ==========================================

        function chaveMes(data) {

            const ano =
                data.getFullYear();


            const mes =
                String(
                    data.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            return `${ano}-${mes}`;

        }


        // ==========================================
        // SELIC POR MÊS
        // ==========================================

        /*
        A série 432 registra alterações da meta.

        Vamos percorrer cronologicamente
        e descobrir qual taxa estava vigente
        em cada mês.
        */

        const selicOrdenada =
            dadosSelic
                .map(item => {

                    return {

                        data:
                            parseDataBr(
                                item.data
                            ),

                        valor:
                            Number(
                                String(
                                    item.valor
                                ).replace(
                                    ",",
                                    "."
                                )
                            )

                    };

                })
                .filter(item => {

                    return (
                        Number.isFinite(
                            item.valor
                        ) &&
                        !Number.isNaN(
                            item.data.getTime()
                        )
                    );

                })
                .sort(
                    (a, b) =>
                        a.data - b.data
                );


        // ==========================================
        // IPCA MENSAL
        // ==========================================

        const ipcaMensal =
            dadosIpca
                .map(item => {

                    const data =
                        parseDataBr(
                            item.data
                        );


                    return {

                        data:
                            data,

                        chave:
                            chaveMes(
                                data
                            ),

                        valor:
                            Number(
                                String(
                                    item.valor
                                ).replace(
                                    ",",
                                    "."
                                )
                            )

                    };

                })
                .filter(item => {

                    return (
                        Number.isFinite(
                            item.valor
                        ) &&
                        !Number.isNaN(
                            item.data.getTime()
                        )
                    );

                })
                .sort(
                    (a, b) =>
                        a.data - b.data
                );


        if (
            ipcaMensal.length < 12
        ) {

            throw new Error(
                "Dados insuficientes de IPCA."
            );

        }


        // ==========================================
        // DESCOBRIR SELIC VIGENTE
        // ==========================================

        function obterSelicNaData(
            dataReferencia
        ) {

            let taxa =
                null;


            for (
                const registro
                of selicOrdenada
            ) {

                if (
                    registro.data <=
                    dataReferencia
                ) {

                    taxa =
                        registro.valor;

                }

                else {

                    break;

                }

            }


            return taxa;

        }


        // ==========================================
        // CRIAR SÉRIE MENSAL
        // ==========================================

        const serie = [];


        for (
            let i = 11;
            i < ipcaMensal.length;
            i++
        ) {

            // ======================================
            // IPCA ACUMULADO 12 MESES
            // ======================================

            const janela =
                ipcaMensal.slice(
                    i - 11,
                    i + 1
                );


            let fator =
                1;


            janela.forEach(item => {

                fator *=
                    (
                        1 +
                        item.valor / 100
                    );

            });


            const ipca12 =
                (
                    fator - 1
                ) * 100;


            const referencia =
                ipcaMensal[i];


            // ======================================
            // SELIC VIGENTE
            // ======================================

            const selic =
                obterSelicNaData(
                    referencia.data
                );


            if (
                !Number.isFinite(
                    selic
                )
            ) {

                continue;

            }


            // ======================================
            // JURO REAL
            // ======================================

            const juroReal =
                (
                    (
                        1 +
                        selic / 100
                    )
                    /
                    (
                        1 +
                        ipca12 / 100
                    )
                    -
                    1
                ) * 100;


            serie.push({

                data:
                    referencia.data.getTime(),

                referencia:
                    referencia.chave,

                selic:
                    Number(
                        selic.toFixed(2)
                    ),

                ipca12:
                    Number(
                        ipca12.toFixed(2)
                    ),

                juroReal:
                    Number(
                        juroReal.toFixed(2)
                    )

            });

        }


        // ==========================================
        // LIMITAR AO PERÍODO ESCOLHIDO
        // ==========================================

        const serieFinal =
            serie.slice(
                -quantidadeMeses
            );


        if (
            serieFinal.length === 0
        ) {

            throw new Error(
                "Nenhum ponto histórico foi gerado."
            );

        }


        // ==========================================
        // RESPOSTA
        // ==========================================

        res.json({

            periodo:
                periodo,

            quantidade:
                serieFinal.length,

            pontos:
                serieFinal,

            fontes: {

                selic:
                    "Banco Central do Brasil - SGS 432",

                ipca:
                    "Banco Central do Brasil - SGS 433"

            }

        });


    } catch (erro) {

        console.error(
            "❌ Erro histórico Selic x IPCA:",
            erro
        );


        res.status(500).json({

            erro:
                "Falha ao buscar histórico Selic x IPCA.",

            detalhes:
                erro.message

        });

    }

});



// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});