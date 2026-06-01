# Plano de Execução — Corretor de Redações com IA

## Descrição do Problema e Usuário-Alvo

Estudantes da educação básica têm dificuldade em desenvolver a habilidade de escrita por falta de feedback rápido e detalhado sobre suas redações. Professores, sobrecarregados, não conseguem corrigir com a frequência e profundidade necessárias.

O sistema proposto é um **corretor de redações assistido por IA**, onde o aluno escreve ou cola uma redação e recebe instantaneamente uma nota simbólica e feedback detalhado apontando erros e sugestões de melhora — como se fosse a correção de um professor.

**Usuário-alvo:** Alunos da educação básica que desejam praticar e melhorar sua escrita de forma autônoma.

---

## Entidades do Sistema

### User
| Campo | Tipo | Descrição |
|---|---|---|
| id | int (PK) | Identificador único |
| name | string | Nome do usuário |
| email | string | E-mail (único) |
| password_hash | string | Senha criptografada |
| created_at | datetime | Data de criação da conta |

### Essay
| Campo | Tipo | Descrição |
|---|---|---|
| id | int (PK) | Identificador único |
| user_id | int (FK) | Referência ao usuário |
| title | string | Título da redação |
| content | text | Conteúdo da redação |
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
| improvement_points | text | Lista de pontos de melhora gerados pela IA |
| summary | text | Resumo geral da avaliação |
| created_at | datetime | Data de geração do feedback |

---

## Funcionalidade de IA e Integração no Fluxo

**Ferramenta:** API Gemini 2.0 Flash (Google AI Studio) — gratuita.

**Como se encaixa no fluxo:**

```
Aluno escreve a redação
        ↓
Frontend envia para o backend (POST /essays) com token JWT
        ↓
Backend salva a redação no banco de dados
        ↓
Backend monta prompt com o texto + rubrica de avaliação
e envia para a API do Gemini
        ↓
Gemini retorna JSON estruturado com nota, scores por critério
e pontos de melhora
        ↓
Backend salva o Feedback no banco e retorna para o frontend
        ↓
Frontend exibe nota, critérios e sugestões lado a lado com o texto
```

**Critérios avaliados pela IA:**
- Coesão (uso de conectivos e progressão do texto)
- Coerência (lógica e sentido geral)
- Gramática e ortografia
- Vocabulário (adequação e riqueza)
- Estrutura textual (introdução, desenvolvimento, conclusão)

**Nota simbólica:** A (Ótimo), B (Bom), C (Regular), D (Insuficiente)

---

## Layout e Telas do Sistema

O sistema é composto por uma **única tela principal** com layout fixo e um **modal de login/cadastro**:

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR: Logo                        [Entrar]        │
├───────────────┬─────────────────────┬───────────────┤
│               │                     │               │
│   SIDEBAR     │     TEXTAREA        │   FEEDBACK    │
│   Histórico   │     (redação)       │   nota +      │
│   de redações │                     │   critérios   │
│               │   bloqueado se      │               │
│   oculta se   │   não logado        │               │
│   não logado  │                     │               │
└───────────────┴─────────────────────┴───────────────┘
```

- **Navbar:** sempre visível; exibe "Entrar" se não logado, ou nome do usuário + logout se logado
- **Modal de Login/Cadastro:** abre ao clicar em "Entrar", sem redirecionar para outra página
- **Sidebar (histórico):** aparece apenas para usuários logados, lista as últimas redações enviadas
- **Área principal:** textarea para escrever a redação (bloqueada se não logado) e painel de feedback ao lado

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
| Integração com API do Gemini e geração de feedback | João Cavani |
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

### Sprint 4 — Integração, Testes e Entrega (30/06 → 13/07)
| Tarefa | Responsável |
|---|---|
| Testes de fluxo completo (login → envio → feedback) | João Cavani e De Paula |
| Correção de bugs e ajustes de UX | De Paula |
| README.md com instruções de instalação e execução | De Paula |
| Preparação para apresentação final | João Cavani e De Paula |

---

## Stack Tecnológica

| Camada | Tecnologia ||
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Python + FastAPI |
| Banco de dados | SQLite via SQLModel |
| Autenticação | JWT (PyJWT) |
| IA | Gemini 2.0 Flash (Google AI Studio) |
