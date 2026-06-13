# EducAI — Corretor de Redações e Exercícios de Matemática com IA

Sistema web para apoio à educação básica, com correção automática de redações e resolução de exercícios de matemática geradas por IA.

## Sobre o Projeto

O aluno escreve um texto ou um exercício e recebe feedback instantâneo gerado por inteligência artificial.

### Modo Redações

O aluno escreve ou cola um texto e recebe uma nota simbólica (A/B/C/D) e feedback detalhado por critério. O tipo de texto é pré-selecionado com base na série do aluno, mas pode ser alterado manualmente:

| Tipo | Público | Foco da avaliação |
|---|---|---|
| Redação | Ensino Médio | Tese, argumentos, coesão, conclusão (estilo ENEM) |
| Texto | 8º e 9º ano | Estrutura narrativa, coesão, coerência |
| Carta | 1º ao 7º ano | Ortografia, vocabulário, estrutura (saudação/corpo/despedida) |

### Modo Matemática

O aluno envia um exercício ou uma conta e recebe resolução passo a passo com equações formatadas em LaTeX.

| Modo | Uso |
|---|---|
| Exercício | Enunciados com contexto ("João percorre...") — salvo no histórico |
| Conta | Expressão direta ("3/4 + 1/2") — resultado imediato, sem salvar |

## Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Python + FastAPI
- **Banco de dados:** SQLite (via SQLModel)
- **Autenticação:** JWT (python-jose + bcrypt)
- **IA:** Groq API — modelo `llama-3.3-70b-versatile`
- **Renderização de LaTeX:** KaTeX

## Pré-requisitos

- Node.js 18+
- Python 3.11+
- Conta no [Groq](https://console.groq.com) para obter a API key (gratuita, sem restrição regional)

## Instalação e Execução

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Crie o arquivo `.env` na raiz do projeto (fora de `backend/`):

```
GROQ_API_KEY=sua_chave_aqui
JWT_SECRET=uma_string_secreta_qualquer
```

```bash
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O sistema estará disponível em `http://localhost:5173`.

## Estrutura do Repositório

```
/
├── backend/
│   ├── routers/
│   │   ├── users.py      # /register, /login, /user/me
│   │   ├── essays.py     # /essays (CRUD + correção por IA)
│   │   └── math.py       # /math/exercises, /math/exercise, /math/calc
│   ├── models.py         # Tabelas do banco (User, Essay, Feedback, MathExercise)
│   ├── schemas.py        # Formatos de entrada/saída da API (Pydantic)
│   ├── auth.py           # Hash de senha (bcrypt) e tokens JWT
│   ├── groq_ai.py        # Integração com Groq/Llama: correct_redacao, correct_texto, correct_carta, solve_exercise, solve_calc
│   ├── database.py       # Conexão com SQLite
│   ├── main.py           # Entrada da aplicação, CORS, registro de routers
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx              # Orquestrador: controla página ativa e autenticação
│       ├── pages/
│       │   ├── EssaysPage.jsx   # Tela inicial (não logado)
│       │   ├── HomePage.jsx     # Modo redações (logado)
│       │   └── MathPage.jsx     # Modo matemática (logado)
│       ├── components/
│       │   ├── shared/          # Navbar, Sidebar, LoginModal, AccountModal, Button, Logo
│       │   ├── essays/          # EssayEditor, EssayFeedbackPanel
│       │   └── math/            # MathEditor, MathFeedbackPanel, LatexText
│       ├── hooks/
│       │   ├── useAuth.js       # Login, registro, perfil, senha, exclusão de conta
│       │   ├── useEssays.js     # Listagem, envio e exclusão de redações
│       │   └── useMath.js       # Listagem, envio e exclusão de exercícios
│       └── services/
│           └── api.js           # Camada de comunicação com o backend (fetch + JWT)
└── README.md
```

## Equipe

- João Pedro de Paula
- João Pedro Cavani
