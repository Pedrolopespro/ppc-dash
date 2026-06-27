import React, { useState } from 'react'
import { Play, Pause, RefreshCw, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { useN8N } from '../context/N8NContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusIcon = {
  success: <CheckCircle2 size={13} className="text-green-400" />,
  error: <XCircle size={13} className="text-red-400" />,
  warning: <AlertTriangle size={13} className="text-yellow-400" />,
  running: <RefreshCw size={13} className="text-blue-400 animate-spin" />,
}

export default function WorkflowCard({ workflow, executions = [] }) {
  const { toggleWorkflow } = useN8N()
  const [toggling, setToggling] = useState(false)

  if (!workflow) return null

  const lastEx = executions[0]
  const lastStatus = lastEx?.status || null
  const isActive = workflow.active

  const handleToggle = async () => {
    setToggling(true)
    await toggleWorkflow(workflow.id, isActive)
    setToggling(false)
  }

  const successCount = executions.filter((e) => e.status === 'success').length
  const errorCount = executions.filter((e) => e.status === 'error').length

  return (
    <div className="card flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight">{workflow.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            {isActive ? (
              <span className="badge-active"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />Ativo</span>
            ) : (
              <span className="badge-inactive"><span className="w-1.5 h-1.5 rounded-full bg-gray-500" />Inativo</span>
            )}
            {lastStatus && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                {statusIcon[lastStatus] || null}
                Último: {lastStatus}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={isActive ? 'Desativar' : 'Ativar'}
          className={`p-2 rounded-lg transition-colors ${
            isActive
              ? 'bg-green-500/10 hover:bg-red-500/10 text-green-400 hover:text-red-400'
              : 'bg-gray-500/10 hover:bg-green-500/10 text-gray-400 hover:text-green-400'
          }`}
        >
          {toggling ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : isActive ? (
            <Pause size={14} />
          ) : (
            <Play size={14} />
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-green-400">
          <CheckCircle2 size={12} />
          <span>{successCount} ok</span>
        </div>
        {errorCount > 0 && (
          <div className="flex items-center gap-1.5 text-red-400">
            <XCircle size={12} />
            <span>{errorCount} erro{errorCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Last execution */}
      {lastEx && (
        <div className="pt-3 border-t border-dark-600 flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={11} />
          <span>
            {formatDistanceToNow(new Date(lastEx.startedAt), { addSuffix: true, locale: ptBR })}
          </span>
        </div>
      )}
    </div>
  )
}
