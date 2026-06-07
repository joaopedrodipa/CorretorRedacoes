import { useState } from 'react'

// Usuário mockado que representa um aluno do ensino médio
const MOCK_USER = {
  id: 1,
  name: 'Ana Silva',
  email: 'ana@email.com',
  grade: '3º EM',
}

// Gerencia o estado de autenticação do usuário
// implementar depois (fazer no terceiro sprint)
export function useAuth() {
  const [user, setUser] = useState(null)

  // Simula login: aceita qualquer email/senha por enquanto
  function login(email, password) {
    if (!email || !password) return false
    setUser(MOCK_USER)
    return true
  }

  // Simula cadastro: aceita qualquer dado por enquanto
  function register(name, email, password, grade) {
    if (!name || !email || !password || !grade) return false
    setUser({ id: Date.now(), name, email, grade })
    return true
  }

  // Atualiza nome, senha e série do usuário (email não pode ser alterado)
  function updateUser(name, password, grade) {
    if (!name || !grade) return false
    setUser((prev) => ({ ...prev, name, grade }))
    return true
  }

  // Exclui a conta do usuário
  function deleteAccount() {
    setUser(null)
  }

  function logout() {
    setUser(null)
  }

  return { user, login, register, logout, updateUser, deleteAccount }
}
