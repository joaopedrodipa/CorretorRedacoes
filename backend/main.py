from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routers import users, essays, math

app = FastAPI(title="EducAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(users.router)
app.include_router(essays.router)
app.include_router(math.router)

@app.get("/")
def root():
    return {"status": "EducAI API rodando"}
