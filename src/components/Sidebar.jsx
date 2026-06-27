import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Zap, Users, Settings, ChevronRight,
  Activity, TrendingUp, MapPin, FileText, Bell, BarChart2
} from 'lucide-react'
import { useN8N } from '../context/N8NContext'

const kmonLinks = [
  { to: '/kmon/keywords', icon: TrendingUp, label: 'Keywords', wf: 'WF-01' },
  { to: '/kmon/geo', icon: MapPin, label: 'Geográfico', wf: 'WF-02' },
  { to: '/kmon/copy', icon: FileText, label: 'Sugestões de Copy', wf: 'WF-03' },
  { to: '/kmon/alertas', icon: Bell, label: 'Alertas Urgentes', wf: 'WF-04' },
  { to: '/kmon/relatorio', icon: BarChart2, label: 'Relatório Semanal', wf: 'WF-05' },
]

const limaLinks = [
  { to: '/lima/funil', icon: Activity, label: 'Análise de Funil', wf: 'WF-06' },
  { to: '/lima/criativos', icon: Zap, label: 'Criativos & Fadiga', wf: 'WF-07' },
  { to: '/lima/placements', icon: LayoutDashboard, label: 'Placements', wf: 'WF-08' },
  { to: '/lima/copy', icon: FileText, label: 'Copy Anúncio + LP', wf: 'WF-09' },
  { to: '/lima/produtos', icon: Users, label: 'Por Produto', wf: 'WF-10' },
]

function NavGroup({ title, links, badge }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mb-2 flex items-center gap-2">
        {title}
        {badge && <span className="text-brand text-[10px] bg-brand/10 px-1.5 py-0.5 rounded">{badge}</span>}
      </p>
      {links.map(({ to, icon: Icon, label, wf }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 group ${
              isActive
                ? 'bg-brand/15 text-brand font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
            }`
          }
        >
          <Icon size={14} />
          <span className="flex-1">{label}</span>
          <span className="text-[10px] text-gray-600 group-hover:text-gray-500">{wf}</span>
        </NavLink>
      ))}
    </div>
  )
}

export default function Sidebar() {
  const { online, loading } = useN8N()

  return (
    <aside className="w-60 bg-dark-800 border-r border-dark-600 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-dark-600">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">PPC DASH</p>
            <p className="text-[10px] text-gray-500">Assistente de Tráfego</p>
          </div>
        </div>
        {/* Status N8N */}
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : online ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className={loading ? 'text-yellow-400' : online ? 'text-green-400' : 'text-red-400'}>
            N8N {loading ? 'conectando...' : online ? 'online' : 'offline'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-4 ${
              isActive ? 'bg-brand/15 text-brand font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
            }`
          }
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </NavLink>

        <NavGroup title="KMON VIP" badge="Google Ads" links={kmonLinks} />
        <NavGroup title="Lima Ferreira" badge="Meta Ads" links={limaLinks} />
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-dark-600">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-brand/15 text-brand' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-700'
            }`
          }
        >
          <Settings size={14} />
          <span>Configurações</span>
        </NavLink>
      </div>
    </aside>
  )
}
