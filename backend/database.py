from sqlmodel import SQLModel, create_engine, Session
import models  # garante que as tabelas são registradas antes do create_all

DATABASE_URL = "sqlite:///./educai.db"

engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
