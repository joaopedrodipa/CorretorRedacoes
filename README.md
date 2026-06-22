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

O aluno envia um exercício ou uma conta e recebe resolução passo a passo com equações formatadas.

| Modo | Uso |
|---|---|
| Exercício | Enunciados com contexto ("João percorre...") — salvo no histórico |
| Conta | Expressão direta ("3/4 + 1/2") — resultado imediato, sem salvar |

### Dashboard

Exibe gráfico de evolução de notas, média geral e pontos de melhora gerados pela IA com base nas últimas redações corrigidas.

## Manual do Usuário

Guia rápido para quem vai usar o EducAI pela primeira vez — sem precisar entender nada de código.

### 1. Cadastro e login

Na tela inicial, clique em **Cadastrar** e informe nome, e-mail, senha e a sua série escolar (isso define quais critérios de avaliação a IA vai usar). Já com conta criada, use **Entrar** para fazer login.

### 2. Corrigindo um texto

1. No menu superior, clique em **Redações**
2. Escreva ou cole o seu texto no campo central
3. Escolha o tipo de texto, se quiser mudar o que já vem selecionado pela sua série:
   - **Redação** — dissertativa, estilo ENEM (Ensino Médio)
   - **Texto** — narrativo (8º/9º ano)
   - **Carta** — com saudação, corpo e despedida (1º ao 7º ano)
4. Clique em **Corrigir** e aguarde a avaliação da IA (alguns segundos)
5. O resultado aparece ao lado: uma nota geral (A, B, C ou D), a nota detalhada por critério (coesão, coerência, gramática, vocabulário e estrutura) e uma lista de pontos para melhorar
6. Todas as redações enviadas ficam salvas no seu histórico, na barra lateral

### 3. Resolvendo exercícios de matemática

1. No menu superior, clique em **Matemática**
2. Escolha o modo:
   - **Exercício** — para enunciados com contexto (ex: "Um carro percorre 100 km em 2 horas..."). Fica salvo no histórico
   - **Conta** — para uma expressão direta (ex: "3/4 + 1/2"). Mostra o resultado na hora, sem salvar
3. Digite o enunciado ou a conta e clique em **Resolver**
4. A IA mostra a resolução passo a passo, com as fórmulas e resultados já formatados

### 4. Acompanhando sua evolução

Clique em **Dashboard** no menu superior para ver:
- O gráfico com a evolução das suas notas ao longo do tempo
- A média geral de todas as redações corrigidas
- Sua última nota
- Pontos de melhora, resumidos pela IA com base nas suas últimas correções

### 5. Gerenciando sua conta

Clique em **Conta** (próximo ao seu nome, no canto superior direito) para atualizar seus dados, trocar sua senha ou excluir sua conta. Para sair, use o botão **Sair**.

## Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Python + FastAPI
- **Banco de dados:** SQLite (via SQLModel — arquivo criado automaticamente)
- **Autenticação:** JWT (python-jose + bcrypt)
- **IA:** Groq API — modelo `llama-3.3-70b-versatile`
- **Renderização de equações:** KaTeX

## Pré-requisitos

- **Node.js 20.19+ ou 22.12+** — [nodejs.org](https://nodejs.org) (o Vite 8 não roda em versões mais antigas, incluindo a 18 LTS)
- **Python 3.11+** — [python.org](https://www.python.org/downloads)
- **Conta no Groq** (gratuita) para obter a chave de API — [console.groq.com](https://console.groq.com)

> Para verificar as versões instaladas: `node -v` e `python --version`

## Configuração da API Key

1. Acesse [console.groq.com](https://console.groq.com) e crie uma conta gratuita
2. Vá em **API Keys → Create API Key** e copie a chave gerada
3. Crie o arquivo `.env` na **raiz do repositório** (mesma pasta do README) com o seguinte conteúdo:

```
GROQ_API_KEY=sua_chave_aqui
JWT_SECRET=qualquer_string_secreta
```

> O arquivo `.env` nunca deve ser commitado. Ele já está no `.gitignore`.

## Instalação e Execução

É necessário rodar o **backend** e o **frontend** ao mesmo tempo, cada um em um terminal separado.

### Terminal 1 — Backend

```bash
cd backend
python -m venv venv
```

Ativar o ambiente virtual:

- **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
- **Windows (cmd.exe):** `venv\Scripts\activate.bat`
- **Mac/Linux:** `source venv/bin/activate`

> No PowerShell, se aparecer erro de política de execução, rode `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` e tente novamente.

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.  
O banco de dados SQLite (`educai.db`) é criado automaticamente na primeira execução.

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

O sistema estará disponível em `http://localhost:5173`.

> Abra `http://localhost:5173` no navegador. O backend precisa estar rodando para o login e as funcionalidades de IA funcionarem.

## Estrutura do Repositório

```
/
├── .env                          # Chave da API e JWT secret (não commitado)
├── backend/
│   ├── routers/
│   │   ├── users.py              # /register, /login, /user/me
│   │   ├── essays.py             # /essays (CRUD + correção + dashboard)
│   │   └── math.py               # /math/exercises, /math/exercise, /math/calc
│   ├── models.py                 # Tabelas do banco (User, Essay, Feedback, MathExercise)
│   ├── schemas.py                # Formatos de entrada/saída da API (Pydantic)
│   ├── auth.py                   # Hash de senha (bcrypt) e tokens JWT
│   ├── groq_ai.py                # Integração Groq: correção de textos, resolução de exercícios, resumo do dashboard
│   ├── database.py               # Conexão com SQLite
│   ├── main.py                   # Entrada da aplicação, CORS, registro de routers
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx               # Orquestrador: página ativa e autenticação
│       ├── pages/
│       │   ├── EssaysPage.jsx    # Tela inicial (não logado)
│       │   ├── HomePage.jsx      # Modo redações (logado)
│       │   ├── MathPage.jsx      # Modo matemática (logado)
│       │   └── DashboardPage.jsx # Dashboard de desempenho (logado)
│       ├── components/
│       │   ├── shared/           # Navbar, LoginModal, AccountModal, Button
│       │   ├── essays/           # EssayEditor, EssayFeedbackPanel
│       │   └── math/             # MathEditor, MathFeedbackPanel, LatexText
│       ├── hooks/
│       │   ├── useAuth.js        # Login, registro, perfil, senha, exclusão
│       │   ├── useEssays.js      # Listagem, envio e exclusão de redações
│       │   └── useMath.js        # Listagem, envio e exclusão de exercícios
│       └── services/
│           └── api.js            # Comunicação com o backend (fetch + JWT)
└── README.md
```

## Equipe

- João Pedro de Paula
- João Pedro Cavani
