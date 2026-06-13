import { useState } from 'react'
import { api } from '../services/api'

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}

export function useAuth() {
  const [user, setUser] = useState(getStoredUser)

  async function login(email, password) {
    try {
      const data = await api.login({ email, password })
      const userData = { id: data.user_id, name: data.name, email: data.email, grade: data.grade }
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  async function register(name, email, password, grade) {
    try {
      const data = await api.register({ name, email, password, grade })
      const userData = { id: data.user_id, name: data.name, email: data.email, grade: data.grade }
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  async function updateUser(name, grade) {
    try {
      const data = await api.updateProfile({ name, grade })
      const userData = { id: data.user_id, name: data.name, email: data.email, grade: data.grade }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  async function changePassword(currentPassword, newPassword) {
    try {
      await api.changePassword({ current_password: currentPassword, new_password: newPassword })
      return true
    } catch (err) {
      return err.message || 'Erro ao alterar senha.'
    }
  }

  async function deleteAccount() {
    try {
      await api.deleteAccount()
    } catch {}
    logout()
  }

  return { user, login, register, logout, updateUser, changePassword, deleteAccount }
}
