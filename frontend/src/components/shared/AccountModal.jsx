import { useState } from 'react'
import Button from './Button'
import Logo from './Logo'

const GRADES = [
  '1º ano', '2º ano', '3º ano', '4º ano', '5º ano',
  '6º ano', '7º ano', '8º ano', '9º ano',
  '1º EM', '2º EM', '3º EM',
]

// Modal de gerenciamento da conta do usuário
// Props: isOpen, onClose, user, onUpdate(name, grade), onDelete()
export default function AccountModal({ isOpen, onClose, user, onUpdate, onChangePassword, onDelete }) {
  const [name, setName] = useState(user?.name ?? '')
  const [grade, setGrade] = useState(user?.grade ?? '')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteError, setDeleteError] = useState('')

  if (!isOpen) return null

  async function handleUpdate(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name || !grade) { setError('Preencha nome e série.'); return }
    const ok = await onUpdate(name, grade)
    if (!ok) { setError('Erro ao salvar. Tente novamente.'); return }
    setSuccess('Dados atualizados com sucesso!')
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordError('')
    if (!currentPassword || !newPassword) {
      setPasswordError('Preencha os dois campos.')
      return
    }
    const result = await onChangePassword(currentPassword, newPassword)
    if (result === true) {
      setPasswordSuccess('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
    } else {
      setPasswordError(result || 'Erro ao alterar senha.')
    }
  }

  function handleDelete(e) {
    e.preventDefault()
    if (deleteConfirm !== 'DELETAR') {
      setDeleteError('Digite exatamente "DELETAR" para confirmar.')
      return
    }
    onDelete()
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl border border-indigo-300 shadow-2xl shadow-indigo-200/50 w-full max-w-md relative"
          style={{ padding: '16px 24px 20px 24px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>

          <Logo />
          <p className="text-base font-semibold text-gray-700 mb-4">Minha conta</p>

          {error && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3 bg-green-50 px-3 py-2 rounded-lg">{success}</p>}

          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-gray-700"
            >
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <hr className="border-gray-200" />
            <Button type="submit" className="w-full">Salvar alterações</Button>
          </form>

          <div style={{ marginTop: '8px' }}>
            <Button
              variant="warning"
              className="w-full"
              onClick={() => { setShowPassword(true); setPasswordError(''); setPasswordSuccess('') }}
            >
              Alterar senha
            </Button>
          </div>

          <div style={{ marginTop: '8px' }}>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => { setShowDeleteConfirm(true); setDeleteError(''); setDeleteConfirm('') }}
            >
              Excluir conta
            </Button>
          </div>
        </div>
      </div>

      {showPassword && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowPassword(false)}
        >
          <div
            className="bg-white rounded-xl border border-yellow-300 shadow-2xl w-full max-w-sm relative"
            style={{ padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowPassword(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            <p className="text-base font-semibold text-gray-700 mb-4">Alterar senha</p>

            {passwordError && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 text-sm mb-3 bg-green-50 px-3 py-2 rounded-lg">{passwordSuccess}</p>}

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              <hr className="border-gray-200" />
              <Button type="submit" variant="warning" className="w-full">Confirmar alteração</Button>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-xl border border-red-300 shadow-2xl w-full max-w-sm relative"
            style={{ padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowDeleteConfirm(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            <p className="text-base font-semibold text-red-500 mb-1">Excluir conta</p>
            <p className="text-xs text-gray-400 mb-4">
              Esta ação é irreversível. Digite <strong>DELETAR</strong> para confirmar.
            </p>

            {deleteError && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{deleteError}</p>}

            <form onSubmit={handleDelete} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder='Digite "DELETAR" para confirmar'
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="border border-red-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-400"
              />
              <Button type="submit" variant="danger" className="w-full">Confirmar exclusão</Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
