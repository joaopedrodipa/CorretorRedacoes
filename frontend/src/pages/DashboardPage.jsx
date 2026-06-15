import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { api } from '../services/api'

// Segue as cores da sidebar
const gradeColor = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-red-100 text-red-700',
}

// Limpa o texto do grock

function parseAnalise(texto) {
  if (!texto) return []
  return texto
    .split('\n')
    .map((l) =>
      l
        .replace(/\*+/g, '')             
        .replace(/^[\-•\d]+[.)]\s*/, '') 
        .replace(/;$/, '')               
        .trim()
    )
    .filter((l) => l.length >= 15 && !l.endsWith(':')
  )
}

// Painel de dashboard 
// api.getDashboard() deve retorna: total_redacoes, media_geral, grafico_evolucao[{ data, nota, nota_letra }], resumo_analitico
export default function DashboardPage() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const response = await api.getDashboard()
        setDados(response)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        setErro('Não foi possível carregar os dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }
    carregarDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Carregando análises...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">{erro}</p>
      </div>
    )
  }

  if (dados?.mensagem) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">{dados.mensagem}</p>
      </div>
    )
  }

  const ultimaNota = dados.grafico_evolucao?.[dados.grafico_evolucao.length - 1]
  const pontos = parseAnalise(dados.resumo_analitico)

  return (
    <div className="flex-1 overflow-y-auto w-full" style={{ padding: '20px' }}>
      <div className="flex flex-col gap-4 w-full">

       {/* Cabeçalho  */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe seu desempenho e evolução recente dos seus textos</p>
        </div>

        {/* ── Gráfico */}
        <div className="flex gap-4" style={{ alignItems: 'stretch' }}>

          
          {dados.grafico_evolucao?.length > 0 && (
            <div
              className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 flex flex-col"
              style={{ padding: '16px' }}
            >
              <p
                className="text-sm font-semibold text-gray-700 shrink-0"
                style={{ marginBottom: '12px' }}
              >
                Evolução das notas
              </p>
              {}
              <div className="flex-1" style={{ minHeight: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dados.grafico_evolucao}
                    margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="data"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value, _name, props) => [
                        `${props.payload.nota_letra} — ${value} pts`,
                        'Nota',
                      ]}
                      labelFormatter={(label) => label}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '12px',
                        boxShadow: 'none',
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey="nota"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {}
          <div className="flex flex-col gap-3" style={{ width: '168px', flexShrink: 0 }}>

            <div
              className="flex-1 bg-white rounded-xl border border-gray-200"
              style={{ padding: '14px' }}
            >
              <p
                className="text-xs font-semibold text-gray-400 uppercase"
                style={{ marginBottom: '6px' }}
              >
                Total de textos
              </p>
              <p className="text-2xl font-bold text-indigo-600 leading-none">
                {dados.total_redacoes}
              </p>
            </div>

            <div
              className="flex-1 bg-white rounded-xl border border-gray-200"
              style={{ padding: '14px' }}
            >
              <p
                className="text-xs font-semibold text-gray-400 uppercase"
                style={{ marginBottom: '6px' }}
              >
                Média geral
              </p>
              <p className="text-2xl font-bold text-indigo-600 leading-none">
                {dados.media_geral.toFixed(1)}
              </p>
              <p className="text-xs text-gray-400" style={{ marginTop: '4px' }}>de 100 pts</p>
            </div>

            {ultimaNota && (
              <div
                className="flex-1 bg-white rounded-xl border border-gray-200"
                style={{ padding: '14px' }}
              >
                <p
                  className="text-xs font-semibold text-gray-400 uppercase"
                  style={{ marginBottom: '6px' }}
                >
                  Última nota
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-lg font-bold px-2 py-0.5 rounded-full ${
                      gradeColor[ultimaNota.nota_letra] ?? 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {ultimaNota.nota_letra}
                  </span>
                  <span className="text-xs text-gray-400">{ultimaNota.nota} pts</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Pontos de melhora  */}
        {pontos.length > 0 && (
          <div
            className="bg-white rounded-xl border border-gray-200"
            style={{ padding: '16px' }}
          >
            <p
              className="text-sm font-semibold text-gray-700"
              style={{ marginBottom: '12px' }}
            >
              Pontos de melhora
            </p>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
            >
              {pontos.map((ponto, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-100 bg-gray-50"
                  style={{ padding: '10px 12px' }}
                >
                  <p className="text-sm text-gray-700 leading-snug">{ponto}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}