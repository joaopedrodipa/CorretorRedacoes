import os
import re
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
_MODEL = "llama-3.3-70b-versatile"


def _parse_json(text: str) -> dict:
    text = text.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()
    # O JSON do Groq pode ter convertido \frac → chr(12)+"rac" (form feed, pois \f = form feed em JSON).
    # Cenário 1: chr(12) já está no texto → restaura como \\f + resto
    text = re.sub(r'\x0c([a-zA-Z]*)', lambda m: '\\\\f' + m.group(1), text)
    # Cenário 2: backslash literal ainda no texto → json.loads corromperia → dobra a barra
    text = re.sub(r'(?<!\\)\\([a-zA-Z]{2,})', lambda m: '\\\\' + m.group(1), text)
    return json.loads(text)


def _call(prompt: str) -> str:
    response = _client.chat.completions.create(
        model=_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content


def correct_redacao(content: str, grade: str) -> dict:
    prompt = f"""Você é um professor que corrige redações dissertativo-argumentativas de alunos do Ensino Médio brasileiro (estilo ENEM).
O aluno é do "{grade}".

Texto:
{content}

Avalie com rigor adequado ao Ensino Médio nos critérios abaixo. Responda APENAS com JSON válido, sem texto extra:
{{
  "overall_grade": "A ou B ou C ou D",
  "coesao": 0,
  "coerencia": 0,
  "gramatica": 0,
  "vocabulario": 0,
  "estrutura": 0,
  "improvement_points": ["ponto 1", "ponto 2", "ponto 3"],
  "summary": "resumo geral da avaliação"
}}

Substitua os 0 por notas de 0 a 10.
- coesao: uso de conectivos e progressão lógica entre ideias
- coerencia: consistência e clareza das argumentações
- gramatica: ortografia, pontuação e concordância
- vocabulario: riqueza e precisão do vocabulário
- estrutura: presença e qualidade de introdução, desenvolvimento e conclusão
Conceito: A=Ótimo(média>8), B=Bom(6-8), C=Regular(4-6), D=Insuficiente(<4)"""

    return _parse_json(_call(prompt))


def correct_texto(content: str, grade: str) -> dict:
    prompt = f"""Você é um professor que corrige textos de alunos do 8º e 9º ano do Ensino Fundamental brasileiro.
O aluno é do "{grade}".

Texto:
{content}

Avalie com expectativas compatíveis com o 8º/9º ano. Responda APENAS com JSON válido, sem texto extra:
{{
  "overall_grade": "A ou B ou C ou D",
  "coesao": 0,
  "coerencia": 0,
  "gramatica": 0,
  "vocabulario": 0,
  "estrutura": 0,
  "improvement_points": ["ponto 1", "ponto 2", "ponto 3"],
  "summary": "resumo geral da avaliação"
}}

Substitua os 0 por notas de 0 a 10.
- coesao: uso de conectivos e encadeamento das ideias (considere a faixa etária)
- coerencia: clareza e lógica do texto
- gramatica: ortografia e gramática básica
- vocabulario: adequação e variedade do vocabulário para a faixa etária
- estrutura: organização geral (início, meio e fim identificáveis)
Conceito: A=Ótimo(média>8), B=Bom(6-8), C=Regular(4-6), D=Insuficiente(<4)"""

    return _parse_json(_call(prompt))


def correct_carta(content: str, grade: str) -> dict:
    prompt = f"""Você é um professor que corrige cartas escritas por alunos do 1º ao 7º ano do Ensino Fundamental brasileiro.
O aluno é do "{grade}".

Texto:
{content}

Avalie com critérios adequados à faixa etária (crianças e pré-adolescentes). Responda APENAS com JSON válido, sem texto extra:
{{
  "overall_grade": "A ou B ou C ou D",
  "coesao": 0,
  "coerencia": 0,
  "gramatica": 0,
  "vocabulario": 0,
  "estrutura": 0,
  "improvement_points": ["ponto 1", "ponto 2", "ponto 3"],
  "summary": "resumo encorajador com feedback construtivo"
}}

Substitua os 0 por notas de 0 a 10. Seja generoso e encorajador nas notas para crianças.
- coesao: as ideias se conectam de forma compreensível?
- coerencia: a mensagem da carta faz sentido e é clara?
- gramatica: ortografia e gramática básica adequadas à série
- vocabulario: uso de palavras adequadas à idade do aluno
- estrutura: presença de saudação, corpo da carta e despedida
Conceito: A=Ótimo(média>8), B=Bom(6-8), C=Regular(4-6), D=Insuficiente(<4)"""

    return _parse_json(_call(prompt))


def solve_exercise(content: str) -> dict:
    prompt = f"""Você é um professor de matemática para alunos da educação básica e média brasileira.
Resolva o exercício abaixo passo a passo de forma didática.

Exercício:
{content}

IMPORTANTE:
- Escreva todas as expressões, fórmulas e equações usando sintaxe LaTeX entre cifrões simples.
- Prefira resultados em forma decimal arredondada (ex: $166,67$ m/s) em vez de fração irredutível, exceto quando a fração for exata e simples (ex: $\\frac{{1}}{{2}}$).
- Exemplos de LaTeX correto:
  - Fórmula: $v = \\frac{{d}}{{t}}$
  - Equação: $2x + 5 = 11$, resultado $x = 3$
  - Decimal: $v = 166,67$ m/s
  - Raiz: $\\sqrt{{16}} = 4$

Responda APENAS com JSON válido, sem texto extra:
{{
  "steps": ["Passo 1: texto com $expressão$ LaTeX", "Passo 2: ...", "Passo 3: ..."],
  "result": "$resultado em LaTeX$",
  "summary": "explicação resumida com $fórmulas$ em LaTeX quando necessário"
}}"""

    return _parse_json(_call(prompt))


def solve_calc(content: str) -> dict:
    prompt = f"""Você é um professor de matemática.
Resolva a conta abaixo passo a passo, explicando a ordem das operações.

Conta: {content}

IMPORTANTE:
- Escreva todas as expressões e cálculos usando sintaxe LaTeX entre cifrões simples.
- Prefira resultados em forma decimal arredondada quando o resultado não for inteiro ou fração simples.
- Exemplos: $3 \\times 4 = 12$, $\\frac{{3}}{{4}} + \\frac{{1}}{{2}} = 1,25$, $2^3 = 8$, $\\sqrt{{16}} = 4$

Responda APENAS com JSON válido, sem texto extra:
{{
  "steps": ["Passo 1: texto com $expressão$ LaTeX", "Passo 2: ..."],
  "result": "$resultado em LaTeX$",
  "summary": "explicação da ordem de operações usada"
}}"""

    return _parse_json(_call(prompt))
