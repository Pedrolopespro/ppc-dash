// Vercel Serverless Proxy → N8N
// API key lida do env var (seguro) ou do header do browser (fallback)
const N8N_URL = process.env.N8N_URL || 'https://n8n-uzcu.srv1627758.hstgr.cloud'

export default async function handler(req, res) {
  const { path } = req.query
  const targetPath = Array.isArray(path) ? path.join('/') : (path || '')

  // Preservar query string
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  const target = `${N8N_URL}/${targetPath}${qs}`

  // API key: env var tem prioridade, browser header como fallback
  const apiKey = process.env.N8N_API_KEY || req.headers['x-n8n-api-key'] || ''

  console.log(`[proxy] ${req.method} ${target}`)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000) // 8s timeout

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

    const text = await upstream.text()
    console.log(`[proxy] response: ${upstream.status}`)
    res.status(upstream.status)
    try { res.json(JSON.parse(text)) } catch { res.send(text) }

  } catch (err) {
    console.error(`[proxy] error: ${err.message}`)
    res.status(502).json({ error: 'Proxy error', detail: err.message, target })
  }
}
