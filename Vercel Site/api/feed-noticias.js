export default async function handler(req, res) {
  var query = 'engajamento de funcionários OR liderança humanizada OR clima organizacional OR turnover'
  var url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=pt-BR&gl=BR&ceid=BR:pt-419'

  try {
    var response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error('Google News retornou ' + response.status)
    }

    var xml = await response.text()

    var itens = []
    var itemRegex = /<item>([\s\S]*?)<\/item>/g
    var match
    while ((match = itemRegex.exec(xml)) !== null && itens.length < 6) {
      var bloco = match[1]

      var tituloMatch = bloco.match(/<title>([\s\S]*?)<\/title>/)
      var linkMatch = bloco.match(/<link>([\s\S]*?)<\/link>/)
      var pubDateMatch = bloco.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      var sourceMatch = bloco.match(/<source[^>]*>([\s\S]*?)<\/source>/)

      if (!tituloMatch || !linkMatch) continue

      var decodificar = function(s) {
        return s
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '')
          .trim()
      }

      var tituloCompleto = decodificar(tituloMatch[1])
      var fonte = sourceMatch ? decodificar(sourceMatch[1]) : (tituloCompleto.split(' - ').pop() || 'Notícia')
      var titulo = tituloCompleto.replace(' - ' + fonte, '')

      itens.push({
        titulo: titulo,
        fonte: fonte,
        link: decodificar(linkMatch[1]),
        data: pubDateMatch ? pubDateMatch[1] : null
      })
    }

    if (itens.length === 0) throw new Error('Nenhuma notícia encontrada')

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json({ ok: true, itens: itens })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
