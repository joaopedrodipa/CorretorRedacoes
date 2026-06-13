from pydantic import BaseModel


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    grade: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    name: str
    grade: str


class UserPasswordChange(BaseModel):
    current_password: str
    new_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str
    grade: str


class EssayCreate(BaseModel):
    title: str = "Sem título"
    content: str
    text_type: str


class FeedbackOut(BaseModel):
    overall_grade: str
    coesao: int
    coerencia: int
    gramatica: int
    vocabulario: int
    estrutura: int
    improvement_points: list[str]
    summary: str


class EssayOut(BaseModel):
    id: int
    title: str
    content: str
    text_type: str
    submitted_at: str
    feedback: FeedbackOut | None = None


class MathExerciseCreate(BaseModel):
    title: str = "Exercício sem título"
    content: str


class MathCalcRequest(BaseModel):
    content: str


class MathFeedbackOut(BaseModel):
    steps: list[str]
    result: str
    summary: str


class MathExerciseOut(BaseModel):
    id: int
    title: str
    content: str
    type: str = "exercicio"
    submitted_at: str
    feedback: MathFeedbackOut
