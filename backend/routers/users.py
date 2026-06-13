from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import User, Essay, Feedback, MathExercise
from schemas import UserRegister, UserLogin, TokenResponse, UserUpdate, UserPasswordChange
from auth import hash_password, verify_password, create_token, get_current_user

router = APIRouter(tags=["users"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: UserRegister, session: Session = Depends(get_session)):
    if session.exec(select(User).where(User.email == data.email)).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        grade=data.grade,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return TokenResponse(
        access_token=create_token(user.id),
        user_id=user.id,
        name=user.name,
        email=user.email,
        grade=user.grade,
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    return TokenResponse(
        access_token=create_token(user.id),
        user_id=user.id,
        name=user.name,
        email=user.email,
        grade=user.grade,
    )


@router.patch("/user/me", response_model=TokenResponse)
def update_profile(data: UserUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    current_user.name = data.name
    current_user.grade = data.grade
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return TokenResponse(
        access_token=create_token(current_user.id),
        user_id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        grade=current_user.grade,
    )


@router.patch("/user/me/password", status_code=204)
def change_password(data: UserPasswordChange, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Senha atual incorreta.")
    current_user.password_hash = hash_password(data.new_password)
    session.add(current_user)
    session.commit()


@router.delete("/user/me", status_code=204)
def delete_account(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    essays = session.exec(select(Essay).where(Essay.user_id == current_user.id)).all()
    for essay in essays:
        feedback = session.exec(select(Feedback).where(Feedback.essay_id == essay.id)).first()
        if feedback:
            session.delete(feedback)
        session.delete(essay)
    exercises = session.exec(select(MathExercise).where(MathExercise.user_id == current_user.id)).all()
    for ex in exercises:
        session.delete(ex)
    session.delete(current_user)
    session.commit()
