import json
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import MathExercise, User
from schemas import MathExerciseCreate, MathCalcRequest, MathExerciseOut, MathFeedbackOut
from auth import get_current_user
from groq_ai import solve_exercise, solve_calc

router = APIRouter(prefix="/math", tags=["math"])


def _build_exercise_out(ex: MathExercise) -> MathExerciseOut:
    return MathExerciseOut(
        id=ex.id,
        title=ex.title,
        content=ex.content,
        submitted_at=ex.submitted_at.strftime("%Y-%m-%d"),
        feedback=MathFeedbackOut(
            steps=json.loads(ex.steps),
            result=ex.result,
            summary=ex.summary,
        ),
    )


@router.get("/exercises", response_model=list[MathExerciseOut])
def list_exercises(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    exercises = session.exec(select(MathExercise).where(MathExercise.user_id == current_user.id).order_by(MathExercise.submitted_at.desc())).all()
    return [_build_exercise_out(ex) for ex in exercises]


@router.post("/exercise", response_model=MathExerciseOut, status_code=201)
def submit_exercise(data: MathExerciseCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    try:
        result = solve_exercise(data.content)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao chamar IA: {str(e)}")

    ex = MathExercise(
        user_id=current_user.id,
        title=data.title or "Exercício sem título",
        content=data.content,
        steps=json.dumps(result.get("steps", []), ensure_ascii=False),
        result=result.get("result", ""),
        summary=result.get("summary", ""),
    )
    session.add(ex)
    session.commit()
    session.refresh(ex)
    return _build_exercise_out(ex)


@router.post("/calc", response_model=MathFeedbackOut)
def submit_calc(data: MathCalcRequest, current_user: User = Depends(get_current_user)):
    try:
        result = solve_calc(data.content)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao chamar IA: {str(e)}")

    return MathFeedbackOut(
        steps=result.get("steps", []),
        result=result.get("result", ""),
        summary=result.get("summary", ""),
    )


@router.delete("/exercise/{exercise_id}", status_code=204)
def delete_exercise(exercise_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    ex = session.get(MathExercise, exercise_id)
    if not ex or ex.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exercício não encontrado.")
    session.delete(ex)
    session.commit()
