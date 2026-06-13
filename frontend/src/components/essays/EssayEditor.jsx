import { useState, useEffect } from 'react'
import Button from '../shared/Button'

function getDefaultTextType(grade) {
  if (!grade) return 'carta'
  if (grade.includes('EM')) return 'redacao'
  const year = parseInt(grade)
  if (year >= 8) return 'texto'
  return 'carta'
}

const TEXT_TYPE_LABELS = {
  redacao: 'Redação (Ensino Médio)',
  texto: 'Texto (8º e 9º ano)',
  carta: 'Carta (1º ao 7º ano)',
}

// Área principal de escrita e envio da redação
// Props: userGrade, essay (redação selecionada ou null), onSubmit
export default function EssayEditor({ userGrade, essay, onSubmit }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [textType, setTextType] = useState(getDefaultTextType(userGrade))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Preenche os campos quando uma redação é selecionada, limpa quando é null
  useEffect(() => {
    if (essay) {
      setTitle(essay.title ?? '')
      setContent(essay.content ?? '')
      setTextType(essay.text_type ?? getDefaultTextType(userGrade))
    } else {
      setTitle('')
      setContent('')
      setTextType(getDefaultTextType(userGrade))
    }
    setError('')
  }, [essay])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Escreva sua redação antes de enviar.')
      return
    }
    if (content.trim().split(/\s+/).length < 10) {
      setError('Texto muito curto. Escreva pelo menos algumas frases.')
      return
    }

    setLoading(true)
    try {
      await onSubmit(title, content, textType)
    } catch (err) {
      setError(err.message || 'Erro ao corrigir. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-full">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Título (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
        />
        <select
          value={textType}
          onChange={(e) => setTextType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-gray-700"
        >
          {Object.entries(TEXT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Escreva ou cole sua redação aqui..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-500 min-h-64"
      />

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Corrigindo...' : 'Corrigir'}
      </Button>
    </form>
  )
}
