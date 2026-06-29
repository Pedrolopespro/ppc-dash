const N8N = process.env.N8N_URL || 'https://n8n-uzcu.srv1627758.hstgr.cloud'

export default async function handler(req, res) {
  const key = process.env.N8N_API_KEY || req.headers['x-n8n-api-key'] || ''
  const { workflowId, limit = 30 } = req.query
  const wf = workflowId ? `&workflowId=${workflowId}` : ''
  try {
    const r = await fetch(`${N8N}/api/v1/executions?limit=${limit}${wf}`, {
      headers: { 'X-N8N-API-KEY': key, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    res.status(r.status).json(await r.json())
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
}
