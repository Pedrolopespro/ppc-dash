// Proxy via Nginx (produção) ou Vite dev server (desenvolvimento)
const BASE = '/n8n-api/api/v1'

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
  // Workflows
  listWorkflows: () =>
    fetch(`${BASE}/workflows?limit=100`, { headers: h() }).then(handle),

  getWorkflow: (id) =>
    fetch(`${BASE}/workflows/${id}`, { headers: h() }).then(handle),

  activateWorkflow: (id) =>
    fetch(`${BASE}/workflows/${id}/activate`, { method: 'POST', headers: h() }).then(handle),

  deactivateWorkflow: (id) =>
    fetch(`${BASE}/workflows/${id}/deactivate`, { method: 'POST', headers: h() }).then(handle),

  // Execuções
  listExecutions: (workflowId, limit = 20) => {
    const wf = workflowId ? `&workflowId=${workflowId}` : ''
    return fetch(`${BASE}/executions?limit=${limit}${wf}`, { headers: h() }).then(handle)
  },

  getExecution: (id) =>
    fetch(`${BASE}/executions/${id}`, { headers: h() }).then(handle),

  // Health
  ping: () =>
    fetch('/n8n-api/healthz').then((r) => r.ok),
}
