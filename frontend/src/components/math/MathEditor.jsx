import { useState, useRef, useEffect } from 'react'
import Button from '../shared/Button'

const SYMBOLS = ['+', '−', '×', '÷', '=', '(', ')', '²', '³', '√', 'π', '%']

// Editor de matemática com seletor de modo e teclado virtual de símbolos
// Props: exercise (exercício selecionado ou null), onSubmitExercise, onSubmitCalc
export default function MathEditor({ exercise, onSubmitExercise, onSubmitCalc }) {
  const [mode, setMode] = useState('exercicio')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  // Preenche os campos quando um exercício é selecionado, limpa quando é null
  useEffect(() => {
    if (exercise) {
      setTitle(exercise.title ?? '')
      setContent(exercise.content ?? '')
      setMode('exercicio')
    } else {
      setTitle('')
      setContent('')
    }
  }, [exercise])

  function insertSymbol(symbol) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newContent = content.slice(0, start) + symbol + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + symbol.length, start + symbol.length)
    }, 0)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    setLoading(true)
    try {
      if (mode === 'exercicio') {
        await onSubmitExercise(title, content)
      } else {
        await onSubmitCalc(content)
        setContent('')
      }
    } catch (err) {
      setError(err.message || 'Erro ao corrigir. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-3">
      {/* Seletor de modo */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setMode('exercicio'); setTitle(''); setContent('') }}
          className="flex-1 py-1 rounded-full text-sm font-medium transition-colors"
          style={mode === 'exercicio'
            ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }
            : { backgroundColor: '#f3f4f6', color: '#6b7280' }}
        >
          Exercício
        </button>
        <button
          type="button"
          onClick={() => { setMode('conta'); setTitle(''); setContent('') }}
          className="flex-1 py-1 rounded-full text-sm font-medium transition-colors"
          style={mode === 'conta'
            ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }
            : { backgroundColor: '#f3f4f6', color: '#6b7280'
          }}
        >
          Conta
        </button>
      </div>

      {mode === 'exercicio' && (
        <input
          type="text"
          placeholder="Título do exercício"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
        />
      )}

      <textarea
        ref={textareaRef}
        placeholder={mode === 'exercicio' ? 'Digite o enunciado do exercício...' : 'Digite a conta (ex: 3/4 + 1/2)'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
      />

      {/* Teclado virtual de símbolos matemáticos */}
      <div className="flex flex-wrap gap-2">
        {SYMBOLS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => insertSymbol(s)}
            className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px' }}>{error}</p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Corrigindo...' : 'Corrigir'}
      </Button>
    </form>
  )
}
