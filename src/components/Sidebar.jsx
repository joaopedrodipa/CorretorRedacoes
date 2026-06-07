import { useState } from 'react'

// Barra lateral com histórico de redações do usuário logado
// Props: essays, selectedEssay, onSelect, onDelete(id), onNewEssay
export default function Sidebar({ essays, selectedEssay, onSelect, onDelete, onNewEssay }) {
  // Redação aguardando confirmação de exclusão
  const [toDelete, setToDelete] = useState(null)

  const gradeColor = {
    A: 'bg-green-100 text-green-700',
    B: 'bg-blue-100 text-blue-700',
    C: 'bg-yellow-100 text-yellow-700',
    D: 'bg-red-100 text-red-700',
  }

  function confirmDelete() {
    onDelete(toDelete.id)
    setToDelete(null)
  }

  return (
    <>
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Botão nova correção */}
        <div style={{ padding: '12px 16px 8px 16px' }}>
          <button
            onClick={onNewEssay}
            className="w-full bg-indigo-600 text-white text-sm py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            + Nova Correção
          </button>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase px-4 pb-2">
          Recentes
        </p>

        {essays.length === 0 ? (
          <p className="text-xs text-gray-400 px-4">Nenhuma redação ainda.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {essays.map((essay) => (
              <li key={essay.id} className="relative group">
                <button
                  onClick={() => onSelect(essay)}
                  className={`w-full text-left px-4 py-3 pr-8 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedEssay?.id === essay.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <p className="text-sm text-gray-800 truncate">{essay.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      gradeColor[essay.feedback?.overall_grade] ?? 'bg-gray-100 text-gray-500'
                    }`}>
                      {essay.feedback?.overall_grade ?? '—'}
                    </span>
                    <span className="text-xs text-gray-400">{essay.submitted_at}</span>
                  </div>
                </button>

                {/* Botão lixeira — aparece ao passar o mouse */}
                <button
                  onClick={(e) => { e.stopPropagation(); setToDelete(essay) }}
                  className="absolute top-3 right-2 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Excluir redação"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Janela de confirmação de exclusão */}
      {toDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setToDelete(null)}
        >
          <div
            className="bg-white rounded-xl border border-red-200 shadow-2xl w-full max-w-sm"
            style={{ padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-gray-700 mb-1">Excluir redação</p>
            <p className="text-sm text-gray-400 mb-6">
              Tem certeza que deseja excluir <strong>"{toDelete.title}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white text-sm py-2 rounded-full hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
