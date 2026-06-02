import { useState } from 'react'

// Redações mockadas com dados verossímeis ao domínio
const MOCK_ESSAYS = [
  {
    id: 1,
    title: 'A importância da tecnologia na educação',
    text_type: 'redacao',
    content: 'A tecnologia tem transformado profundamente a educação nas últimas décadas. Com o advento da internet e dos dispositivos móveis, o acesso ao conhecimento tornou-se mais democrático e abrangente. No entanto, é preciso refletir sobre os desafios que essa transformação impõe às escolas e aos professores.',
    submitted_at: '2026-05-28',
    feedback: {
      overall_grade: 'B',
      coesao: 7,
      coerencia: 8,
      gramatica: 6,
      vocabulario: 7,
      estrutura: 8,
      improvement_points: [
        'Desenvolver melhor a argumentação no segundo parágrafo',
        'Revisar o uso de vírgulas após conectivos',
        'A conclusão poderia propor uma solução mais concreta',
      ],
      summary:
        'Boa redação com argumentos relevantes e estrutura bem organizada. Atenção à pontuação e ao aprofundamento das ideias.',
    },
  },
  {
    id: 2,
    title: 'Os desafios do meio ambiente no século XXI',
    text_type: 'redacao',
    content: 'O meio ambiente enfrenta desafios sem precedentes no século XXI. O aquecimento global, a perda da biodiversidade e a poluição dos oceanos são problemas que exigem ação imediata de governos, empresas e cidadãos. Somente com políticas públicas eficazes e mudanças de comportamento será possível preservar o planeta para as próximas gerações.',
    submitted_at: '2026-05-20',
    feedback: {
      overall_grade: 'A',
      coesao: 9,
      coerencia: 9,
      gramatica: 8,
      vocabulario: 9,
      estrutura: 9,
      improvement_points: [
        'Pequenos erros de acentuação em duas palavras',
      ],
      summary:
        'Excelente redação. Argumentação sólida, vocabulário rico e estrutura impecável. Parabéns!',
    },
  },
  {
    id: 3,
    title: 'Redes sociais e saúde mental',
    text_type: 'redacao',
    content: 'As redes sociais tornaram-se parte integrante da vida dos jovens. Embora facilitem a comunicação e o acesso à informação, estudos apontam uma relação entre o uso excessivo dessas plataformas e problemas como ansiedade e depressão. É necessário estabelecer limites saudáveis para o uso das redes sociais.',
    submitted_at: '2026-05-10',
    feedback: {
      overall_grade: 'C',
      coesao: 5,
      coerencia: 6,
      gramatica: 5,
      vocabulario: 6,
      estrutura: 5,
      improvement_points: [
        'Texto carece de conectivos entre os parágrafos',
        'A tese central não está clara na introdução',
        'Muitos erros de concordância verbal',
        'Conclusão muito curta e sem proposta de intervenção',
      ],
      summary:
        'O tema é interessante mas o texto precisa de revisão geral. Foco na estrutura e na coesão.',
    },
  },
]

// Gerencia a lista de redações e a redação selecionada
// implementar depois (fazer no terceiro sprint)
export function useEssays() {
  const [essays, setEssays] = useState(MOCK_ESSAYS)
  const [selectedEssay, setSelectedEssay] = useState(null)

  // Simula o envio para correção pela IA
  // Retorna um feedback mockado após 1.5s para simular o tempo de resposta
  function submitEssay(title, content, textType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEssay = {
          id: Date.now(),
          title: title || 'Sem título',
          text_type: textType,
          submitted_at: new Date().toISOString().slice(0, 10),
          feedback: {
            overall_grade: 'B',
            coesao: 7,
            coerencia: 7,
            gramatica: 8,
            vocabulario: 6,
            estrutura: 7,
            improvement_points: [
              'Este é um feedback de exemplo gerado localmente',
              'Feedback simulado — o Gemini vai gerar o feedback real',
            ],
            summary: 'Feedback simulado.',
          },
        }
        setEssays((prev) => [newEssay, ...prev])
        setSelectedEssay(newEssay)
        resolve(newEssay)
      }, 1500)
    })
  }

  // Remove uma redação da lista pelo id
  function deleteEssay(id) {
    setEssays((prev) => prev.filter((e) => e.id !== id))
    setSelectedEssay((prev) => (prev?.id === id ? null : prev))
  }

  return { essays, selectedEssay, setSelectedEssay, submitEssay, deleteEssay }
}
