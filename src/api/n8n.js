// Em dev: proxy via Vite (vite.config.js)
// Em produção (Vercel): proxy via serverless function /api/n8n/[...path].js
// → sem CORS, sem expor URL do N8N no frontend
// /n8n-api/* → rewrite Vercel → /api/n8n-proxy/* → função catch-all → N8N
const BASE = '/n8n-api/api/v1'
const HEALTH = '/n8n-api/healthz'

const getKey = () => localStorage.getItem('n8n_api_key') || ''

const h = () => ({
  'X-N8N-API-KEY': getKey(),
  'Content-Type': 'application/json',
})

const handle = async (res) => {
  if (!res.ok) throw new Error(`N8N API ${res.status}: ${res.statusText}`)
  return res.json()
}

export const n8n = {
  listWorkflows: () =>
    fetch(`${BASE}/workflows?limit=100`, { headers: h() }).then(handle),

  getWorkflow: (id) =>
    fetch(`${BASE}/workflows/${id}`, { headers: h() }).then(handle),

  activateWorkflow: (id) =>
    fetch(`${BASE}/workflows/${id}/activate`, { method: 'POST', headers: h() }).then(handle),

  deactivateWorkflow: (id) =>
    fetch(`${BASE}/workflows/${id}/deactivate`, { method: 'POST', headers: h() }).then(handle),

  listExecutions: (workflowId, limit = 20) => {
    const wf = workflowId ? `&workflowId=${workflowId}` : ''
    return fetch(`${BASE}/executions?limit=${limit}${wf}`, { headers: h() }).then(handle)
  },

  getExecution: (id) =>
    fetch(`${BASE}/executions/${id}`, { headers: h() }).then(handle),

  ping: () =>
    fetch(HEALTH).then((r) => r.ok).catch(() => false),
}
