# CorretorIA — Corretor de Redações com Inteligência Artificial

Sistema web para correção de redações de alunos da educação básica, com feedback automático gerado por IA.

## Sobre o Projeto

O aluno escreve ou cola uma redação e recebe instantaneamente uma nota simbólica (A/B/C/D) e feedback detalhado por critério — coesão, coerência, gramática, vocabulário e estrutura textual.

## Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Python + FastAPI
- **Banco de dados:** SQLite (via SQLModel)
- **Autenticação:** JWT
- **IA:** Gemini 2.0 Flash (Google AI Studio)

## Pré-requisitos

- Node.js 18+
- Python 3.11+
- Conta no [Google AI Studio](https://aistudio.google.com) para obter a API key do Gemini

## Instalação e Execução

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend/` com:

```
GEMINI_API_KEY=sua_chave_aqui
SECRET_KEY=uma_chave_secreta_qualquer
```

Inicie o servidor:

```bash
uvicorn main:app --reload
```

O backend estará disponível em `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Estrutura do Repositório

```
/
├── backend/
│   ├── routers/       # Rotas da API
│   ├── models/        # Modelos do banco de dados
│   ├── schemas/       # Schemas de validação
│   ├── auth/          # Autenticação JWT
│   └── main.py        # Entrada da aplicação
├── frontend/
│   ├── index.html       # HTML principal
│   └── src/
│       ├── main.jsx     # Entrada da aplicação React
│       ├── App.jsx      # Componente raiz
│       ├── components/  # Navbar, Sidebar, FeedbackPanel, LoginModal...
│       ├── hooks/       # useAuth, useEssays
│       └── services/    # Chamadas à API do backend
└── README.md
```

## Equipe

- João Pedro de Paula
- João Pedro Cavani
- Manuela 