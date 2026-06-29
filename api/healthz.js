const N8N = process.env.N8N_URL || 'https://n8n-uzcu.srv1627758.hstgr.cloud'

export default async function handler(req, res) {
  try {
    const r = await fetch(`${N8N}/healthz`, { signal: AbortSignal.timeout(5000) })
    res.status(r.ok ? 200 : 503).json({ ok: r.ok, status: r.status })
  } catch (e) {
    res.status(503).json({ ok: false, error: e.message })
  }
}
