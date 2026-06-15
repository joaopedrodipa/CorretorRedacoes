import json
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Essay, Feedback, User
from schemas import EssayCreate, EssayOut, FeedbackOut
from auth import get_current_user
from groq_ai import correct_redacao, correct_texto, correct_carta, gerar_resumo_dashboard


_CORRECTORS = {
    'redacao': correct_redacao,
    'texto': correct_texto,
    'carta': correct_carta,
}

router = APIRouter(prefix="/essays", tags=["essays"])


def _build_essay_out(essay: Essay, feedback: Feedback | None) -> EssayOut:
    fb = None
    if feedback:
        fb = FeedbackOut(
            overall_grade=feedback.overall_grade,
            coesao=feedback.coesao,
            coerencia=feedback.coerencia,
            gramatica=feedback.gramatica,
            vocabulario=feedback.vocabulario,
            estrutura=feedback.estrutura,
            improvement_points=json.loads(feedback.improvement_points),
            summary=feedback.summary,
        )
    return EssayOut(
        id=essay.id,
        title=essay.title,
        content=essay.content,
        text_type=essay.text_type,
        submitted_at=essay.submitted_at.strftime("%Y-%m-%d"),
        feedback=fb,
    )




@router.get("", response_model=list[EssayOut])
def list_essays(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    essays = session.exec(select(Essay).where(Essay.user_id == current_user.id).order_by(Essay.submitted_at.desc())).all()
    result = []
    for essay in essays:
        feedback = session.exec(select(Feedback).where(Feedback.essay_id == essay.id)).first()
        result.append(_build_essay_out(essay, feedback))
    return result


@router.post("", response_model=EssayOut, status_code=201)
def submit_essay(data: EssayCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    essay = Essay(
        user_id=current_user.id,
        title=data.title or "Sem título",
        content=data.content,
        text_type=data.text_type,
    )
    session.add(essay)
    session.commit()
    session.refresh(essay)

    try:
        corrector = _CORRECTORS.get(data.text_type, correct_redacao)
        result = corrector(data.content, current_user.grade)
    except Exception as e:
        session.delete(essay)
        session.commit()
        raise HTTPException(status_code=502, detail=f"Erro ao chamar IA: {str(e)}")

    feedback = Feedback(
        essay_id=essay.id,
        overall_grade=result.get("overall_grade", "C"),
        coesao=result.get("coesao", 5),
        coerencia=result.get("coerencia", 5),
        gramatica=result.get("gramatica", 5),
        vocabulario=result.get("vocabulario", 5),
        estrutura=result.get("estrutura", 5),
        improvement_points=json.dumps(result.get("improvement_points", []), ensure_ascii=False),
        summary=result.get("summary", ""),
    )
    session.add(feedback)
    session.commit()

    return _build_essay_out(essay, feedback)


@router.delete("/{essay_id}", status_code=204)
def delete_essay(essay_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    essay = session.get(Essay, essay_id)
    if not essay or essay.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Redação não encontrada.")
    feedback = session.exec(select(Feedback).where(Feedback.essay_id == essay_id)).first()
    if feedback:
        session.delete(feedback)
    session.delete(essay)
    session.commit()


@router.get("/dashboard")
async def get_dashboard_data(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Buscar redações do usuário pelo SQLModel ordenadas da mais antiga para a mais nova
    essays = session.exec(select(Essay).where(Essay.user_id == current_user.id).order_by(Essay.submitted_at.asc())).all()
    
    if not essays:
        return {"mensagem": "Nenhuma redação encontrada ainda para gerar o dashboard."}

    historico_notas = []
    feedbacks_textos = []
    
    # Mapeamento para converter as notas em letras para números para o Gráfico
    mapa_notas = {"A": 100, "B": 80, "C": 60, "D": 40, "F": 0}
    
    for essay in essays:
        # Buscar o feedback correspondente a essa redação
        feedback = session.exec(select(Feedback).where(Feedback.essay_id == essay.id)).first()
        
        if feedback:
            nota_numero = mapa_notas.get(feedback.overall_grade, 0)
            
            historico_notas.append({
                "data": essay.submitted_at.strftime("%d/%m/%Y"),
                "nota": nota_numero,
                "nota_letra": feedback.overall_grade,
                "titulo": essay.title
            })
            feedbacks_textos.append(feedback.summary)

    #  Limitar os textos 
    ultimos_feedbacks = " | ".join(feedbacks_textos[-5:])
    
    #  Gerar resumo
    resumo_ia = "Faltam dados suficientes de feedback para gerar análise."
    if ultimos_feedbacks:
        resumo_ia = await gerar_resumo_dashboard(ultimos_feedbacks)

    #  Calcular média geral 
    media_geral = 0
    if len(historico_notas) > 0:
        media_geral = sum(r["nota"] for r in historico_notas) / len(historico_notas)

    return {
        "total_redacoes": len(essays),
        "media_geral": media_geral,
        "grafico_evolucao": historico_notas,
        "resumo_analitico": resumo_ia
    }