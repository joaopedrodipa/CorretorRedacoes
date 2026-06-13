import LatexText from './LatexText'

// Painel de feedback para modo matemática — exibe resolução passo a passo
export default function MathFeedbackPanel({ feedback }) {
  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
        <span className="text-4xl">🔢</span>
        <p>A resolução aparecerá aqui após o envio.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Resolução passo a passo</p>
        <ol className="flex flex-col gap-2">
          {feedback.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ marginTop: '1px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}
              >
                {i + 1}
              </span>
              <LatexText text={step} />
            </li>
          ))}
        </ol>
      </div>

      {feedback.result && (
        <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-primary-light)' }}>
          <p className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-primary)' }}>Resultado</p>
          <p className="text-lg font-bold" style={{ color: 'var(--color-primary-dark)' }}><LatexText text={feedback.result} /></p>
        </div>
      )}

      {feedback.summary && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Resumo</p>
          <p className="text-sm text-gray-700"><LatexText text={feedback.summary} /></p>
        </div>
      )}
    </div>
  )
}
