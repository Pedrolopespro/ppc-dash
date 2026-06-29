// Chama os endpoints Vercel serverless (api/*.js) — sem CORS, sem proxy catch-all
const getKey = () => localStorage.getItem('n8n_api_key') || ''
const h = () => ({ 'X-N8N-API-KEY': getKey() })

const handle = async (res) => {
  if (!res.ok) throw new Error(`N8N API ${res.status}: ${res.statusText}`)
  return res.json()
}

export const n8n = {
  listWorkflows: () =>
    fetch('/api/workflows', { headers: h() }).then(handle),

  activateWorkflow: (id) =>
    fetch(`/api/toggle?id=${id}&action=activate`, { method: 'POST', headers: h() }).then(handle),

  deactivateWorkflow: (id) =>
    fetch(`/api/toggle?id=${id}&action=deactivate`, { method: 'POST', headers: h() }).then(handle),

  listExecutions: (workflowId, limit = 30) => {
    const wf = workflowId ? `&workflowId=${workflowId}` : ''
    return fetch(`/api/executions?limit=${limit}${wf}`, { headers: h() }).then(handle)
  },

  ping: () =>
    fetch('/api/healthz').then((r) => r.ok).catch(() => false),
}
