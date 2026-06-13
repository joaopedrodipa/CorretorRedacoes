import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useEssays } from './hooks/useEssays'
import { useMath } from './hooks/useMath'
import Navbar from './components/shared/Navbar'
import LoginModal from './components/shared/LoginModal'
import AccountModal from './components/shared/AccountModal'
import HomePage from './pages/HomePage'
import EssaysPage from './pages/EssaysPage'
import MathPage from './pages/MathPage'
import './index.css'

export default function App() {
  const { user, login, register, logout, updateUser, changePassword, deleteAccount } = useAuth()
  const { essays, selectedEssay, setSelectedEssay, submitEssay, deleteEssay } = useEssays(user)
  const { exercises, selectedExercise, mathFeedback, selectExercise, setSelectedExercise, submitExercise, submitCalc, deleteExercise } = useMath(user)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginInitialTab, setLoginInitialTab] = useState('login')
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [page, setPage] = useState('essays')

  function openLogin() { setLoginInitialTab('login'); setIsLoginOpen(true) }
  function openRegister() { setLoginInitialTab('register'); setIsLoginOpen(true) }

  return (
    <div className="flex flex-col h-screen" data-theme={page === 'math' ? 'math' : 'essays'}>
      <Navbar
        user={user}
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={logout}
        onAccountClick={() => setIsAccountOpen(true)}
        page={page}
        onPageChange={setPage}
      />

      <div className="flex flex-1 overflow-hidden">
        {user ? (
          page === 'math' ? (
            <MathPage
              exercises={exercises}
              selectedExercise={selectedExercise}
              mathFeedback={mathFeedback}
              selectExercise={selectExercise}
              setSelectedExercise={setSelectedExercise}
              submitExercise={submitExercise}
              submitCalc={submitCalc}
              deleteExercise={deleteExercise}
            />
          ) : (
            <HomePage
              user={user}
              essays={essays}
              selectedEssay={selectedEssay}
              setSelectedEssay={setSelectedEssay}
              submitEssay={submitEssay}
              deleteEssay={deleteEssay}
            />
          )
        ) : (
          <main className="flex flex-1">
            <EssaysPage onLogin={openLogin} onRegister={openRegister} />
          </main>
        )}
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
          onChangePassword={changePassword}
          onDelete={deleteAccount}
        />
      )}
    </div>
  )
}
