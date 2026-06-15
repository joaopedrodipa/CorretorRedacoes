const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erro desconhecido' }))
    throw new Error(err.detail || 'Erro na requisição')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register:       (data) => request('/register', { method: 'POST', body: JSON.stringify(data) }),
  login:          (data) => request('/login', { method: 'POST', body: JSON.stringify(data) }),
  getEssays:      ()     => request('/essays'),
  getDashboard:   ()     => request('/essays/dashboard'),
  submitEssay:    (data) => request('/essays', { method: 'POST', body: JSON.stringify(data) }),
  deleteEssay:    (id)   => request(`/essays/${id}`, { method: 'DELETE' }),
  getExercises:   ()     => request('/math/exercises'),
  submitExercise: (data) => request('/math/exercise', { method: 'POST', body: JSON.stringify(data) }),
  submitCalc:     (data) => request('/math/calc', { method: 'POST', body: JSON.stringify(data) }),
  deleteExercise: (id)   => request(`/math/exercise/${id}`, { method: 'DELETE' }),
  updateProfile:    (data) => request('/user/me', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword:   (data) => request('/user/me/password', { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAccount:    ()     => request('/user/me', { method: 'DELETE' }),
}
