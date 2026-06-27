import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react'
import { useN8N } from '../context/N8NContext'
import ExecutionList from '../components/ExecutionList'

function ClientCard({ name, tag, href, badge, color }) {
  const { byTag } = useN8N()
  const wfs = byTag(tag)
  const active = wfs.filter((w) => w.active).length

  return (
    <Link to={href} className="card hover:border-dark-400 transition-colors group block">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{badge}</p>
          <h2 className="font-bold text-white">{name}</h2>
        </div>
        <ChevronRight size={16} className="text-gray-600 group-hover:text-brand transition-colors" />
      </div>
      <div className="flex gap-4 text-sm">
        <div>
          <p className={`text-2xl font-bold ${color}`}>{active}</p>
          <p className="text-xs text-gray-500">ativos</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-400">{wfs.length}</p>
          <p className="text-xs text-gray-500">total</p>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: Math.max(wfs.length, 5) }).map((_, i) => {
          const wf = wfs[i]
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                !wf ? 'bg-dark-500' : wf.active ? 'bg-green-400' : 'bg-gray-600'
              }`}
            />
          )
        })}
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { executions, loading, error, refresh } = useN8N()

  const errors = executions.filter((e) => e.status === 'error').slice(0, 3)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visão geral dos seus clientes PPC</p>
        </div>
        <button onClick={refresh} disabled={loading} className="btn-ghost flex items-center gap-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <AlertTriangle size={14} />
          {error} — Verifique a chave API em Configurações.
        </div>
      )}

      {/* Clients */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ClientCard
          name="KMON VIP"
          tag="KMON-VIP"
          href="/kmon/keywords"
          badge="Google Ads"
          color="text-blue-400"
        />
        <ClientCard
          name="Lima Ferreira ADV"
          tag="LIMA-FERREIRA"
          href="/lima/funil"
          badge="Meta Ads"
          color="text-indigo-400"
        />
      </div>

      {/* Alerts */}
      {errors.length > 0 && (
        <div className="card mb-6 border-red-500/30">
          <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
            <AlertTriangle size={14} />
            Erros recentes
          </h3>
          <ExecutionList executions={errors} showWorkflow />
        </div>
      )}

      {/* Recent executions */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-4">
          <Activity size={14} />
          Últimas execuções
        </h3>
        {loading ? (
          <div className="py-8 text-center text-gray-600 text-sm">
            <RefreshCw size={16} className="animate-spin mx-auto mb-2" />
            Carregando...
          </div>
        ) : (
          <ExecutionList executions={executions.slice(0, 15)} showWorkflow />
        )}
      </div>
    </div>
  )
}
