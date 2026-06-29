// Vercel Serverless Proxy — elimina CORS entre o browser e o N8N
// Browser chama /n8n-api/... → esta função → N8N (server-side, sem CORS)

const N8N_URL = process.env.N8N_URL || 'https://n8n-uzcu.srv1627758.hstgr.cloud'

export default async function handler(req, res) {
  // Monta o path alvo
  const { path } = req.query
  const targetPath = Array.isArray(path) ? path.join('/') : (path || '')

  // Preservar query string original
  const fullUrl = new URL(req.url, 'http://localhost')
  const search = fullUrl.search || ''
  const target = `${N8N_URL}/${targetPath}${search}`

  // Encaminhar API key do browser para o N8N
  const apiKey = req.headers['x-n8n-api-key'] || ''

  try {
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
    })

    const text = await upstream.text()
    res.status(upstream.status)
    try {
      res.json(JSON.parse(text))
    } catch {
      res.send(text)
    }
  } catch (err) {
    res.status(502).json({ error: 'Proxy error: ' + err.message })
  }
}
