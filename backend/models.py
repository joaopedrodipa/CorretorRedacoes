from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    grade: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Essay(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str = Field(default="Sem título")
    content: str
    text_type: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    essay_id: int = Field(foreign_key="essay.id")
    overall_grade: str
    coesao: int
    coerencia: int
    gramatica: int
    vocabulario: int
    estrutura: int
    improvement_points: str  # JSON string
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MathExercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str = Field(default="Exercício sem título")
    content: str
    steps: str   # JSON string
    result: str
    summary: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
