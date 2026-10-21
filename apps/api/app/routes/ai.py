from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app import rag
from app.db import get_db
from app.llm import get_llm, provider_name
from app.models import Session

router = APIRouter(prefix="/ai", tags=["ai"])

GROUNDING = (
    "Answer using the numbered context passages below and cite them inline like [1]. "
    "If the context does not contain the answer, say so briefly, then answer from general "
    "knowledge and mark that part '(not from your sources)'. Keep answers clear and short: "
    "small paragraphs, bullet lists, a tiny code example when it helps. "
    # qwen2.5 can drift into Chinese mid-answer
    "Always answer in English."
)


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=8000)


class AskIn(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    history: list[Turn] = Field(default_factory=list, max_length=20)


class TutorIn(AskIn):
    session_id: str


class Citation(BaseModel):
    n: int
    url: str
    title: str


class AnswerOut(BaseModel):
    answer: str
    citations: list[Citation]


class StatusOut(BaseModel):
    provider: str


async def _session(db: AsyncSession, session_id: str) -> Session:
    s = await db.get(Session, session_id, options=[selectinload(Session.subchapters)])
    if not s:
        raise HTTPException(404, "Session not found")
    return s


def _outline(s: Session) -> str:
    subs = "\n".join(f"- {c.title}" for c in s.subchapters)
    return f"Session {s.id}: {s.title}\nOutcomes: {s.outcomes}\nSubchapters:\n{subs}"


async def _answer(system: str, body: AskIn, hits: list[rag.Hit]) -> AnswerOut:
    context, citations = rag.build_context(hits)
    prompt = f"{system}\n\n{GROUNDING}\n\nContext:\n{context or '(no indexed passages yet)'}"
    messages = [t.model_dump() for t in body.history] + [{"role": "user", "content": body.question}]
    answer = await get_llm().chat(prompt, messages)
    return AnswerOut(answer=answer, citations=[Citation(**c) for c in citations])


@router.get("/status", response_model=StatusOut)
async def status() -> StatusOut:
    return StatusOut(provider=provider_name())


@router.post("/tutor", response_model=AnswerOut)
async def tutor(body: TutorIn, db: AsyncSession = Depends(get_db)) -> AnswerOut:
    s = await _session(db, body.session_id)
    hits = await rag.retrieve(db, body.question, session_id=s.id)
    if not hits:  # this session's pages aren't indexed yet: search all sources
        hits = await rag.retrieve(db, body.question, kind="source")
    system = (
        "You are a patient tutor for a junior developer without a CS degree who is working "
        "towards a senior software engineer role. Explain with analogies and concrete examples."
        f"\n\nThe learner is studying:\n{_outline(s)}"
    )
    return await _answer(system, body, hits)


@router.post("/ask", response_model=AnswerOut)
async def ask_reading_list(body: AskIn, db: AsyncSession = Depends(get_db)) -> AnswerOut:
    hits = await rag.retrieve(db, body.question, kind="article")
    system = "You help the learner recall and connect articles from their reading list."
    return await _answer(system, body, hits)
