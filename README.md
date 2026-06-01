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