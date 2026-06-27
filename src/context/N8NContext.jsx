import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { n8n } from '../api/n8n'

const N8NContext = createContext(null)

export function N8NProvider({ children }) {
  const [workflows, setWorkflows] = useState([])
  const [executions, setExecutions] = useState([])
  const [online, setOnline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [wfRes, exRes, alive] = await Promise.all([
        n8n.listWorkflows(),
        n8n.listExecutions(null, 30),
        n8n.ping(),
      ])
      setWorkflows(wfRes.data || [])
      setExecutions(exRes.data || [])
      setOnline(alive)
    } catch (e) {
      setError(e.message)
      setOnline(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 60_000) // auto-refresh 1min
    return () => clearInterval(interval)
  }, [refresh])

  const toggleWorkflow = async (id, active) => {
    try {
      if (active) await n8n.deactivateWorkflow(id)
      else await n8n.activateWorkflow(id)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  // Filtrar por tag
  const byTag = (tag) => workflows.filter((w) => w.tags?.some((t) => t.name === tag))

  return (
    <N8NContext.Provider value={{ workflows, executions, online, loading, error, refresh, toggleWorkflow, byTag }}>
      {children}
    </N8NContext.Provider>
  )
}

export const useN8N = () => useContext(N8NContext)
