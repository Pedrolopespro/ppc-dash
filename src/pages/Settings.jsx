import React, { useState, useEffect } from 'react'
import { Save, Eye, EyeOff, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { n8n } from '../api/n8n'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [n8nUrl] = useState('https://n8n-uzcu.srv1627758.hstgr.cloud')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    setApiKey(localStorage.getItem('n8n_api_key') || '')
  }, [])

  const save = () => {
    localStorage.setItem('n8n_api_key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const ok = await n8n.ping()
      setTestResult(ok ? 'ok' : 'error')
    } catch {
      setTestResult('error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-1">Configurações</h1>
      <p className="text-sm text-gray-500 mb-8">Credenciais e conexão com o N8N</p>

      <div className="card space-y-5">
        {/* N8N URL */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">URL do N8N</label>
          <input
            readOnly
            value={n8nUrl}
            className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-600 mt-1">Configurado no Nginx — não editável aqui.</p>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Chave API do N8N
            <span className="ml-2 text-gray-600">(Settings → n8n API → AUDE-OS)</span>
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua chave API aqui..."
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 pr-10 text-sm text-white focus:border-brand focus:outline-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">Armazenada apenas no seu navegador (localStorage).</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="btn-primary flex items-center gap-2">
            {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saved ? 'Salvo!' : 'Salvar'}
          </button>
          <button onClick={testConnection} disabled={testing} className="btn-ghost flex items-center gap-2">
            {testing ? <RefreshCw size={14} className="animate-spin" /> : null}
            Testar conexão
          </button>
        </div>

        {testResult && (
          <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2.5 ${
            testResult === 'ok'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {testResult === 'ok' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {testResult === 'ok' ? 'N8N conectado com sucesso!' : 'Falhou. Verifique a chave API ou se o N8N está online.'}
          </div>
        )}
      </div>

      {/* How to get key */}
      <div className="mt-6 card bg-dark-900">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Como obter a chave API</h3>
        <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
          <li>Acesse <strong className="text-gray-400">n8n-uzcu.srv1627758.hstgr.cloud</strong></li>
          <li>Vá em <strong className="text-gray-400">Settings → n8n API</strong></li>
          <li>A chave existente é <strong className="text-gray-400">AUDE-OS</strong></li>
          <li>Crie uma nova chave se necessário e cole acima</li>
        </ol>
      </div>
    </div>
  )
}
