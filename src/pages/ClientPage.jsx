import React from 'react'
import { RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react'
import { useN8N } from '../context/N8NContext'
import WorkflowCard from '../components/WorkflowCard'
import ExecutionList from '../components/ExecutionList'

export default function ClientPage({ title, subtitle, tag, status, n8nTag }) {
  const { byTag, executions, loading, refresh } = useN8N()
  const workflows = byTag(n8nTag || tag)

  const clientExecs = executions.filter((e) =>
    workflows.some((w) => w.id === e.workflowId)
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{subtitle}</p>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://n8n-uzcu.srv1627758.hstgr.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-1.5 text-xs"
          >
            <ExternalLink size={12} />
            Abrir N8N
          </a>
          <button onClick={refresh} disabled={loading} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Status badge */}
      {status && (
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-2 mb-6 ${
          status.includes('Crítico') || status.includes('Péssimo')
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {status}
        </span>
      )}

      {/* Workflows grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card animate-pulse h-28 bg-dark-700" />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="card mb-8 py-10 text-center">
          <AlertTriangle size={20} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Nenhum workflow encontrado com a tag <strong>{n8nTag || tag}</strong></p>
          <p className="text-xs text-gray-600 mt-1">Verifique se os workflows foram importados no N8N.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              executions={executions.filter((e) => e.workflowId === wf.id)}
            />
          ))}
        </div>
      )}

      {/* Recent executions for this client */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Execuções recentes</h3>
        <ExecutionList executions={clientExecs.slice(0, 20)} showWorkflow />
      </div>
    </div>
  )
}
