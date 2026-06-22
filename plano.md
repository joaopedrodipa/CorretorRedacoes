# Plano de Execução — EducAI

## Descrição do Problema e Usuário-Alvo

Estudantes da educação básica e média têm dificuldade em desenvolver a habilidade de escrita e em praticar matemática por falta de feedback rápido e detalhado. Professores, sobrecarregados, não conseguem corrigir redações nem acompanhar exercícios com a frequência e profundidade necessárias.

O sistema proposto é o **EducAI**, uma plataforma assistida por IA onde o aluno escreve ou cola uma redação — ou envia um exercício de matemática — e recebe instantaneamente uma avaliação detalhada: nota simbólica e feedback por critério para textos, ou resolução passo a passo para exercícios.

**Usuário-alvo:** Alunos da educação básica (1º ao 9º ano) e ensino médio que desejam praticar e melhorar sua escrita e seu desempenho em matemática de forma autônoma.

---

## Entidades do Sistema

### User
| Campo | Tipo | Descrição |
|---|---|---|
| id | int (PK) | Identificador único |
| name | string | Nome do usuário |
| email | string | E-mail (único) |
| password_hash | string | Senha criptografada (bcrypt) |
| grade | string | Ano/série do aluno (ex: "6º ano", "1º EM") |
| created_at | datetime | Data de criação da conta |

### Essay
| Campo | Tipo | Descrição |
|---|---|---|
| id | int (PK) | Identificador único |
| user_id | int (FK) | Referência ao usuário |
| title | string | Título da redação |
| content | text | Conteúdo da redação |
| text_type | string | Tipo de texto ("redacao", "texto" ou "carta") |
| submitted_at | datetime | Data de envio |

### Feedback
| Campo | Tipo | Descrição |
|---|---|---|
| id | int (PK) | Identificador único |
| essay_id | int (FK) | Referência à redação |
| overall_grade | string | Nota simbólica (A, B, C ou D) |
| coesao | int | Pontuação de coesão (0–10) |
| coerencia | int | Pontuação de coerência (0–10) |
| gramatica | int | Pontuação de gramática e ortografia (0–10) |
| vocabulario | int | Pontuação de vocabulário (0–10) |
| estrutura | int | Pontuação de estrutura textual (0–10) |
| improvement_points | text | Lista de pontos de melhora gerados pela IA (JSON) |
| summary | text | Resumo geral da avaliação |
| created_at | datetime | Data de geração do feedback |

### MathExercise
| Campo | Tipo | Descrição |
|---|---|---|
| id | int (PK) | Identificador único |
| user_id | int (FK) | Referência ao usuário |
| title | string | Título do exercício |
| content | text | Enunciado enviado pelo aluno |
| steps | text | Passo a passo da resolução gerado pela IA (JSON) |
| result | string | Resultado final, em LaTeX |
| summary | text | Explicação resumida da resolução |
| submitted_at | datetime | Data de envio |

> Apenas exercícios do modo "Exercício" são salvos como `MathExercise`. O modo "Conta" retorna o resultado direto, sem persistir no banco.

---

## Funcionalidade de IA e Integração no Fluxo

**Ferramenta:** Groq API — modelo `llama-3.3-70b-versatile`, gratuito. (O plano original previa o Gemini 2.0 Flash; a equipe migrou para o Groq durante o desenvolvimento por ser mais simples de integrar e ter respostas mais rápidas.)

**Fluxo — correção de texto:**

```
Aluno escreve a redação/texto/carta
        ↓
Frontend envia para o backend (POST /essays) com token JWT e o tipo de texto
        ↓
Backend salva o texto no banco de dados
        ↓
Backend escolhe o corretor adequado ao tipo (correct_redacao,
correct_texto ou correct_carta) e monta o prompt com a rubrica correspondente
        ↓
Groq retorna JSON estruturado com nota, scores por critério
e pontos de melhora
        ↓
Backend salva o Feedback no banco e retorna para o frontend
        ↓
Frontend exibe nota, critérios e sugestões lado a lado com o texto
```

**Fluxo — exercício de matemática:**

```
Aluno envia um enunciado (Exercício) ou uma expressão direta (Conta)
        ↓
Frontend envia para o backend (POST /math/exercise ou /math/calc)
        ↓
Backend monta o prompt e envia para o Groq, pedindo passo a passo
com fórmulas em LaTeX
        ↓
Groq retorna JSON estruturado com os passos, o resultado e um resumo
        ↓
Se for "Exercício", o backend salva no banco; se for "Conta", retorna direto
        ↓
Frontend renderiza os passos e fórmulas com KaTeX
```

**Tipos de texto suportados e pré-seleção por série:**

| Tipo de texto | Séries | Critérios principais |
|---|---|---|
| Redação | Ensino Médio | Tese, argumentos, coesão, conclusão (estilo ENEM) |
| Texto | 8º e 9º ano | Estrutura narrativa, coesão, coerência |
| Carta | 1º ao 7º ano | Ortografia, vocabulário, estrutura (saudação/corpo/despedida) |

O tipo de texto é **pré-selecionado automaticamente** com base no ano/série informado no cadastro, mas o aluno pode alterar manualmente antes de enviar. Cada tipo usa um prompt e uma função de correção próprios (`correct_redacao`, `correct_texto`, `correct_carta`), com critérios e tom adequados à faixa etária.

**Critérios avaliados pela IA** (adaptados por tipo de texto):
- Coesão (uso de conectivos e progressão do texto)
- Coerência (lógica e sentido geral)
- Gramática e ortografia
- Vocabulário (adequação e riqueza)
- Estrutura textual (introdução, desenvolvimento, conclusão)

**Nota simbólica:** A (Ótimo), B (Bom), C (Regular), D (Insuficiente)

**Modo Matemática:** o aluno escolhe entre **Exercício** (enunciado com contexto, resolução salva no histórico) e **Conta** (expressão direta, resultado imediato sem salvar). A IA responde com passos didáticos e fórmulas em LaTeX, renderizadas no navegador com KaTeX. Os prompts priorizam resultados em forma decimal, exceto quando a fração for exata e simples.

---

## Layout e Telas do Sistema

O sistema é composto por uma **navbar fixa** com três áreas principais, navegação por abas (sem trocar de URL) e modais para login/cadastro e conta:

```
┌──────────────────────────────────────────────────────────────────┐
│ NAVBAR: EducAI   [Redações] [Matemática] [Dashboard]   nome [Conta] [Sair] │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│   Aba Redações:      SIDEBAR (histórico) │ TEXTAREA │ FEEDBACK     │
│   Aba Matemática:    SIDEBAR (histórico) │ ENUNCIADO│ RESOLUÇÃO    │
│   Aba Dashboard:     gráfico de evolução │ cards de resumo         │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

- **Navbar:** sempre visível; exibe os botões **Entrar**/**Cadastrar** se não logado, ou as abas de navegação + nome do usuário + **Conta** + **Sair** se logado
- **Modal de Login/Cadastro:** abre ao clicar em "Entrar" ou "Cadastrar", sem redirecionar para outra página
- **Modal de Conta:** permite atualizar dados do perfil, trocar senha e excluir a conta
- **Aba Redações:** sidebar com histórico de redações, textarea central e painel de feedback ao lado
- **Aba Matemática:** sidebar com histórico de exercícios, campo de enunciado/conta e painel com a resolução passo a passo
- **Aba Dashboard:** gráfico de evolução de notas, cards de total de redações/média/última nota, e pontos de melhora resumidos pela IA

---

## Distribuição de Tarefas por Sprint

### Sprint 1 — Proposta e Protótipo Visual (26/05 → 01/06)
| Tarefa | Responsável |
|---|---|
| Elaboração do plano.md | João Cavani e De Paula |
| Protótipo visual (Figma) — tela principal (navbar + sidebar + corretor) | De Paula |
| Protótipo visual (Figma) — modal de login/cadastro e estado sem login | João Cavani |

### Sprint 2 — Backend (02/06 → 15/06)
| Tarefa | Responsável |
|---|---|
| Setup do projeto FastAPI, estrutura de pastas | De Paula |
| Modelos SQLModel e banco de dados SQLite | De Paula |
| Autenticação JWT (cadastro e login) | De Paula |
| Rotas de essays (criar, listar, buscar por id) | João Cavani |
| Integração com a IA e geração de feedback | João Cavani |
| Rota de feedback (retornar avaliação da redação) | João Cavani |

### Sprint 3 — Frontend (16/06 → 29/06)
| Tarefa | Responsável |
|---|---|
| Setup do projeto React + Tailwind, estrutura de pastas | De Paula |
| Navbar, modal de login/cadastro e contexto de autenticação JWT | De Paula |
| Serviço de autenticação (armazenar e enviar token) | De Paula |
| Área principal: textarea + painel de feedback | João Cavani |
| Sidebar de histórico de redações | João Cavani |
| Integração completa com o backend | João Cavani |
| Modo Matemática (exercício e conta) e renderização LaTeX/KaTeX | De Paula e João Cavani |
| Dashboard de evolução (gráfico, resumo da IA) | João Cavani |

### Sprint 4 — Workshop, Deploy e Entrega Final (30/06 → 13/07)
| Tarefa | Responsável |
|---|---|
| Correção de bugs e ajustes de UX | De Paula |
| Deploy da aplicação no Square Cloud (URL pública) | De Paula |
| Manual do usuário e organização do README | De Paula e João Cavani |
| Preparação e ensaio do pitch (3 minutos) | João Cavani e De Paula |

> O formato da Sprint 4 mudou de "Integração/Testes/Entrega" para um workshop de pitch com avaliadores externos: não é mais necessário documentar testes, mas o deploy público, o manual do usuário e o README seguem como entregas obrigatórias.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Python + FastAPI |
| Banco de dados | SQLite via SQLModel |
| Autenticação | JWT (python-jose + bcrypt) |
| IA | Groq API — modelo `llama-3.3-70b-versatile` |
| Renderização de fórmulas | KaTeX |
| Gráficos do dashboard | Recharts |
