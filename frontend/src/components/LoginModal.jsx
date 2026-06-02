import { useState, useEffect } from 'react'
import Button from './Button'

// Lista de séries disponíveis para seleção no cadastro
const GRADES = [
  '1º ano', '2º ano', '3º ano', '4º ano', '5º ano',
  '6º ano', '7º ano', '8º ano', '9º ano',
  '1º EM', '2º EM', '3º EM',
]

// Modal de login e cadastro com abas
// Props: isOpen, onClose, onLogin(email, password), onRegister(name, email, password, grade)
export default function LoginModal({ isOpen, onClose, onLogin, onRegister, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('')
  const [regGrade, setRegGrade] = useState('')

  // Sincroniza a aba quando o modal abre com um initialTab diferente
  useEffect(() => { if (isOpen) setTab(initialTab) }, [isOpen, initialTab])

  if (!isOpen) return null

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    const ok = onLogin(loginEmail, loginPassword)
    if (!ok) { setError('Preencha todos os campos.'); return }
    onClose()
  }

  function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (!regName || !regEmail || !regPassword || !regPasswordConfirm || !regGrade) {
      setError('Preencha todos os campos.')
      return
    }
    if (regPassword !== regPasswordConfirm) {
      setError('As senhas não coincidem.')
      return
    }
    const ok = onRegister(regName, regEmail, regPassword, regGrade)
    if (!ok) { setError('Erro ao criar conta.'); return }
    onClose()
  }

  function switchTab(newTab) {
    setTab(newTab)
    setError('')
    setSuccess('')
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-indigo-300 shadow-2xl shadow-indigo-200/50 w-full max-w-md relative"
        style={{ padding: '16px 24px 20px 24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar no canto superior direito */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>

        {/* Logo e nome do app */}
        <div className="flex flex-col items-center mb-5">
          <svg viewBox="0 0 64 64" width="40" height="40" className="mb-2">
            <rect x="10" y="6" width="44" height="52" rx="4" fill="#4f46e5"/>
            <rect x="6" y="6" width="8" height="52" rx="3" fill="#312e81"/>
            <line x1="22" y1="22" x2="48" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="22" y1="32" x2="48" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="22" y1="42" x2="40" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <circle cx="10" cy="18" r="2.5" fill="#4f46e5"/>
            <circle cx="10" cy="32" r="2.5" fill="#4f46e5"/>
            <circle cx="10" cy="46" r="2.5" fill="#4f46e5"/>
          </svg>
          <span className="text-lg font-bold text-indigo-600">CorretorTextual</span>
        </div>

        {/* Título da aba atual */}
        <p className="text-base font-semibold text-gray-700 mb-4">
          {tab === 'login' ? 'Acesse sua conta' : 'Criar conta'}
        </p>

        {/* Abas */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tab === 'login'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tab === 'register'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="E-mail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            {/* Separador antes do botão */}
            <hr className="border-gray-200" />
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="E-mail"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Repetir senha"
              value={regPasswordConfirm}
              onChange={(e) => setRegPasswordConfirm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            {/* Série define o tipo de texto padrão no corretor */}
            <select
              value={regGrade}
              onChange={(e) => setRegGrade(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-gray-700"
            >
              <option value="">Selecione seu ano/série</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {/* Separador antes do botão */}
            <hr className="border-gray-200" />
            <Button type="submit" className="w-full">Cadastrar</Button>
          </form>
        )}
      </div>
    </div>
  )
}
