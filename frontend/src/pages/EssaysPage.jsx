import Button from '../components/shared/Button'

const FEATURES = [
  { icon: '📝', title: 'Correção de Redações', desc: 'Envie redações, textos ou cartas e receba feedback com nota e pontos de melhora.' },
  { icon: '🔢', title: 'Exercícios de Matemática', desc: 'Resolva contas e exercícios com explicação passo a passo gerada por IA.' },
  { icon: '📊', title: 'Histórico de Correções', desc: 'Acesse suas correções anteriores e acompanhe sua evolução ao longo do tempo.' },
  { icon: '🎯', title: 'Feedback Personalizado', desc: 'Critérios avaliados individualmente: coesão, gramática, vocabulário e mais.' },
]

export default function EssaysPage({ onLogin, onRegister }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6" style={{ padding: '32px 16px' }}>
      <p className="text-6xl font-extrabold" style={{ color: 'var(--color-primary)' }}>EducAI</p>
      <h1 className="text-2xl font-bold text-gray-700">Corrija suas redações e exercícios com IA</h1>
      <p className="text-gray-400 max-w-sm">
        Envie redações, textos ou exercícios de matemática e receba
        feedback instantâneo com nota e resolução passo a passo.
      </p>
      <div className="flex gap-3">
        <Button onClick={onLogin}>Entrar</Button>
        <Button onClick={onRegister} variant="ghost" style={{ border: '1px solid #4f46e5', color: '#4f46e5' }}>Cadastrar</Button>
      </div>

      {/* Funcionalidades */}
      <div
        className="grid grid-cols-2 gap-4 w-full max-w-xl"
        style={{ marginTop: '16px' }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-xl border border-gray-200 text-left"
            style={{ padding: '16px' }}
          >
            <span className="text-2xl">{f.icon}</span>
            <p className="text-sm font-semibold text-gray-700" style={{ marginTop: '8px' }}>{f.title}</p>
            <p className="text-xs text-gray-400" style={{ marginTop: '4px' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
