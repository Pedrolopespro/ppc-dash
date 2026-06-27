import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { N8NProvider } from './context/N8NContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ClientPage from './pages/ClientPage'
import Settings from './pages/Settings'

// Rotas de KMON VIP — cada uma mostra todos os workflows KMON com scroll até o relevante
const KMON_PROPS = {
  title: 'KMON VIP',
  subtitle: 'Google Ads',
  n8nTag: 'KMON-VIP',
  status: '🔴 Crítico — sem leads, reestruturação em andamento',
}

const LIMA_PROPS = {
  title: 'Lima Ferreira ADV',
  subtitle: 'Meta Ads',
  n8nTag: 'LIMA-FERREIRA',
  status: '🔴 Péssimos resultados — reposicionamento em andamento',
}

export default function App() {
  return (
    <N8NProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {/* KMON VIP — todos os sub-paths mostram os workflows KMON */}
            <Route path="/kmon" element={<Navigate to="/kmon/keywords" replace />} />
            <Route path="/kmon/keywords" element={<ClientPage {...KMON_PROPS} />} />
            <Route path="/kmon/geo" element={<ClientPage {...KMON_PROPS} />} />
            <Route path="/kmon/copy" element={<ClientPage {...KMON_PROPS} />} />
            <Route path="/kmon/alertas" element={<ClientPage {...KMON_PROPS} />} />
            <Route path="/kmon/relatorio" element={<ClientPage {...KMON_PROPS} />} />

            {/* Lima Ferreira — Meta Ads */}
            <Route path="/lima" element={<Navigate to="/lima/funil" replace />} />
            <Route path="/lima/funil" element={<ClientPage {...LIMA_PROPS} />} />
            <Route path="/lima/criativos" element={<ClientPage {...LIMA_PROPS} />} />
            <Route path="/lima/placements" element={<ClientPage {...LIMA_PROPS} />} />
            <Route path="/lima/copy" element={<ClientPage {...LIMA_PROPS} />} />
            <Route path="/lima/produtos" element={<ClientPage {...LIMA_PROPS} />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </N8NProvider>
  )
}
