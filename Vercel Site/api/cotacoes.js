// Cotações para o Radar da página Insights: dólar e euro em reais.
// 1) Mercado ao vivo (AwesomeAPI). 2) Se indisponível: último boletim PTAX do Banco Central do Brasil, com a data.
// Responde sempre { ok, tipo: 'ao_vivo'|'ptax', fonte, usd, eur } ou { ok:false }.

function fmtDataBCB(d) { return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '-' + d.getFullYear() }

async function aoVivo() {
  var r = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL', { headers: { 'User-Agent': 'grandtalent.com.br' } })
  if (!r.ok) throw new Error('awesomeapi ' + r.status)
  var j = await r.json()
  var u = j.USDBRL, e = j.EURBRL
  if (!u || !e || !Number(u.bid) || !Number(e.bid)) throw new Error('awesomeapi sem dados')
  return {
    ok: true, tipo: 'ao_vivo', fonte: 'AwesomeAPI (mercado)',
    usd: { valor: Number(u.bid), quando: new Date(Number(u.timestamp) * 1000).toISOString() },
    eur: { valor: Number(e.bid), quando: new Date(Number(e.timestamp) * 1000).toISOString() }
  }
}

async function ptax(moeda) {
  var fim = new Date(), ini = new Date(Date.now() - 10 * 86400000)
  var url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)" +
    "?@moeda='" + moeda + "'&@dataInicial='" + fmtDataBCB(ini) + "'&@dataFinalCotacao='" + fmtDataBCB(fim) + "'&$format=json"
  var r = await fetch(url)
  if (!r.ok) throw new Error('bcb ' + r.status)
  var j = await r.json()
  var lista = (j.value || []).filter(function (v) { return Number(v.cotacaoVenda) > 0 })
  if (!lista.length) throw new Error('bcb sem dados')
  var ult = lista[lista.length - 1]
  return { valor: Number(ult.cotacaoVenda), quando: String(ult.dataHoraCotacao).replace(' ', 'T').slice(0, 19) + '-03:00', boletim: ult.tipoBoletim }
}

export default async function handler(req, res) {
  try {
    var dados = await aoVivo()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json(dados)
  } catch (e1) {
    try {
      var u = await ptax('USD'), e = await ptax('EUR')
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900')
      return res.status(200).json({ ok: true, tipo: 'ptax', fonte: 'Banco Central do Brasil (PTAX)', usd: u, eur: e })
    } catch (e2) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ ok: false })
    }
  }
}
