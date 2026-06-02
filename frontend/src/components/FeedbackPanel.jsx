// Painel de feedback gerado pela IA
// Props: feedback (objeto com nota, critérios e pontos de melhora), ou null se vazio
export default function FeedbackPanel({ feedback }) {
  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
        <span className="text-4xl">📝</span>
        <p>O feedback aparecerá aqui após a correção.</p>
      </div>
    )
  }

  const gradeStyle = {
    A: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ótimo' },
    B: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Bom' },
    C: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Regular' },
    D: { bg: 'bg-red-100', text: 'text-red-700', label: 'Insuficiente' },
  }

  const grade = gradeStyle[feedback.overall_grade] ?? gradeStyle['C']

  const criteria = [
    { label: 'Coesão', value: feedback.coesao },
    { label: 'Coerência', value: feedback.coerencia },
    { label: 'Gramática', value: feedback.gramatica },
    { label: 'Vocabulário', value: feedback.vocabulario },
    { label: 'Estrutura', value: feedback.estrutura },
  ]

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {/* Nota geral */}
      <div className={`flex items-center gap-3 ${grade.bg} rounded-xl px-4 py-3`}>
        <span className={`text-4xl font-bold ${grade.text}`}>
          {feedback.overall_grade}
        </span>
        <div>
          <p className={`font-semibold ${grade.text}`}>{grade.label}</p>
          <p className="text-xs text-gray-500">Nota geral</p>
        </div>
      </div>

      {/* Critérios com barra de progresso */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-400 uppercase">Critérios</p>
        {criteria.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{c.label}</span>
              <span>{c.value}/10</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-500 rounded-full transition-all"
                style={{ width: `${c.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pontos de melhora */}
      {feedback.improvement_points?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Pontos de melhora
          </p>
          <ul className="flex flex-col gap-2">
            {feedback.improvement_points.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resumo geral */}
      {feedback.summary && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Resumo</p>
          <p className="text-sm text-gray-700">{feedback.summary}</p>
        </div>
      )}
    </div>
  )
}
