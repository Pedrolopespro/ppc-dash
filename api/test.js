// Endpoint de teste — confirma que as serverless functions estão activas
export default function handler(req, res) {
  res.json({
    ok: true,
    url: req.url,
    n8nUrl: process.env.N8N_URL || 'não definida',
    hasApiKey: !!process.env.N8N_API_KEY,
  })
}
