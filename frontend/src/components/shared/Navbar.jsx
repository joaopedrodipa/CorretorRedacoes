import Button from './Button'

// Barra de navegação sempre visível no topo
export default function Navbar({ user, onLoginClick, onRegisterClick, onLogout, onAccountClick, page, onPageChange }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>EducAI</span>

      {user && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange('essays')}
            style={{
              padding: '3px 12px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '500',
              ...(page === 'essays' ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' } : { color: '#6b7280' })
            }}
          >
            Redações
          </button>
          <button
            onClick={() => onPageChange('math')}
            style={{
              padding: '3px 12px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '500',
              ...(page === 'math' ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' } : { color: '#6b7280' })
            }}
          >
            Matemática
          </button>
        </div>
      )}

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name} — {user.grade}
          </span>
          <button
            onClick={onAccountClick}
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            Conta
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Sair
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={onLoginClick}>Entrar</Button>
          <Button onClick={onRegisterClick} variant="ghost" style={{ border: '1px solid #4f46e5', color: '#4f46e5' }}>
            Cadastrar
          </Button>
        </div>
      )}
    </nav>
  )
}
