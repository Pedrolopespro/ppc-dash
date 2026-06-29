// Catch-all proxy para N8N — funciona na raiz do api/
// Rota: /api/n8n-proxy/* → N8N
const N8N_URL = process.env.N8N_URL || 'https://n8n-uzcu.srv1627758.hstgr.cloud'

export default async function handler(req, res) {
  const { slug } = req.query
  const parts = Array.isArray(slug) ? slug : [slug || '']

  // Só processa rotas que começam com 'n8n-proxy'
  if (parts[0] !== 'n8n-proxy') {
    res.status(404).json({ error: 'Not found' })
    return
  }

  // Remover o prefixo 'n8n-proxy' e montar o path do N8N
  const n8nPath = parts.slice(1).join('/')
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  const target = `${N8N_URL}/${n8nPath}${qs}`

  const apiKey = process.env.N8N_API_KEY || req.headers['x-n8n-api-key'] || ''

  console.log(`[proxy] ${req.method} ${target}`)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
      signal: controller.signal,
    })

    clearTimeout(timeout)
    console.log(`[proxy] response: ${upstream.status}`)

    const text = await upstream.text()
    res.status(upstream.status)
    try { res.json(JSON.parse(text)) } catch { res.send(text) }

  } catch (err) {
    console.error(`[proxy] error: ${err.message}`)
    res.status(502).json({ error: 'Proxy error', detail: err.message, target })
  }
}
