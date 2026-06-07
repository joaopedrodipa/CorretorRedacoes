import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useEssays } from './hooks/useEssays'
import Navbar from './components/Navbar'
import Button from './components/Button'
import Sidebar from './components/Sidebar'
import EssayEditor from './components/EssayEditor'
import FeedbackPanel from './components/FeedbackPanel'
import LoginModal from './components/LoginModal'
import AccountModal from './components/AccountModal'
import './index.css'

export default function App() {
  const { user, login, register, logout, updateUser, deleteAccount } = useAuth()
  const { essays, selectedEssay, setSelectedEssay, submitEssay, deleteEssay } = useEssays()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginInitialTab, setLoginInitialTab] = useState('login')
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  function openLogin() { setLoginInitialTab('login'); setIsLoginOpen(true) }
  function openRegister() { setLoginInitialTab('register'); setIsLoginOpen(true) }

  function handleSelectEssay(essay) {
    setSelectedEssay(essay)
  }


  return (
    <div className="flex flex-col h-screen">
      <Navbar
        user={user}
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={logout}
        onAccountClick={() => setIsAccountOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {user && (
          <Sidebar
            essays={essays}
            selectedEssay={selectedEssay}
            onSelect={handleSelectEssay}
            onDelete={deleteEssay}
            onNewEssay={() => setSelectedEssay(null)}
          />
        )}

        <main className="flex flex-1 gap-4 p-4 overflow-hidden">
          {user ? (
            <>
              <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col" style={{ padding: '13px' }}>
                <h2 className="text-sm font-semibold text-gray-500 mb-3">Nova correção</h2>
                <EssayEditor userGrade={user.grade} essay={selectedEssay} onSubmit={submitEssay} />
              </div>

              <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto" style={{ padding: '13px' }}>
                <h2 className="text-sm font-semibold text-gray-500 mb-3">Feedback</h2>
                <FeedbackPanel feedback={selectedEssay?.feedback ?? null} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <span className="text-6xl">✏️</span>
              <h1 className="text-2xl font-bold text-gray-700">Corrija sua redação com IA</h1>
              <p className="text-gray-400 max-w-sm">
                Faça login para enviar sua redação e receber feedback instantâneo
                com nota e sugestões de melhora.
              </p>
              <div className="flex gap-3">
                <Button onClick={openLogin}>Entrar</Button>
                <Button onClick={openRegister} variant="ghost" className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50">Cadastrar</Button>
              </div>
            </div>
          )}
        </main>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
        onRegister={register}
        initialTab={loginInitialTab}
      />

      {user && (
        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          user={user}
          onUpdate={updateUser}
          onDelete={deleteAccount}
        />
      )}
    </div>
  )
}
