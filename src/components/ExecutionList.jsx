import React from 'react'
import { CheckCircle2, XCircle, RefreshCw, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS = {
  success: { icon: <CheckCircle2 size={14} className="text-green-400" />, label: 'Sucesso', cls: 'text-green-400' },
  error: { icon: <XCircle size={14} className="text-red-400" />, label: 'Erro', cls: 'text-red-400' },
  running: { icon: <RefreshCw size={14} className="text-blue-400 animate-spin" />, label: 'Rodando', cls: 'text-blue-400' },
  waiting: { icon: <Clock size={14} className="text-yellow-400" />, label: 'Aguardando', cls: 'text-yellow-400' },
}

export default function ExecutionList({ executions = [], showWorkflow = false }) {
  if (!executions.length) {
    return (
      <div className="py-8 text-center text-gray-600 text-sm">
        Nenhuma execução ainda.
      </div>
    )
  }

  return (
    <div className="divide-y divide-dark-600">
      {executions.map((ex) => {
        const s = STATUS[ex.status] || STATUS.running
        const duration = ex.stoppedAt
          ? `${Math.round((new Date(ex.stoppedAt) - new Date(ex.startedAt)) / 1000)}s`
          : '—'

        return (
          <div key={ex.id} className="flex items-center gap-3 py-3 px-1">
            {s.icon}
            <div className="flex-1 min-w-0">
              {showWorkflow && ex.workflowData?.name && (
                <p className="text-xs text-gray-500 truncate">{ex.workflowData.name}</p>
              )}
              <p className={`text-sm font-medium ${s.cls}`}>{s.label}</p>
            </div>
            <div className="text-right text-xs text-gray-500 shrink-0">
              <p>{duration}</p>
              <p>{formatDistanceToNow(new Date(ex.startedAt), { addSuffix: true, locale: ptBR })}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
