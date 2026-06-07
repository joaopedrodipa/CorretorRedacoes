import Button from './Button'

// Barra de navegação sempre visível no topo
// Mostra "Entrar" se não logado, ou nome + "Conta" + "Sair" se logado
export default function Navbar({ user, onLoginClick, onRegisterClick, onLogout, onAccountClick }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <span className="text-xl font-bold text-indigo-600">CorretorTextual</span>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name} — {user.grade}
          </span>
          {/* Botão Conta — mesmo estilo do Sair */}
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
          <Button onClick={onRegisterClick} variant="ghost" className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
            Cadastrar
          </Button>
        </div>
      )}
    </nav>
  )
}
