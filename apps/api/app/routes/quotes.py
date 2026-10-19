import json
import random
from functools import lru_cache

from fastapi import APIRouter
from pydantic import BaseModel

from app.config import settings

router = APIRouter(tags=["quotes"])


class QuoteOut(BaseModel):
    text: str
    author: str


@lru_cache
def _quotes() -> list[dict]:
    return json.loads((settings.content_dir / "quotes.json").read_text())


@router.get("/quotes/random", response_model=QuoteOut)
async def random_quote() -> QuoteOut:
    return QuoteOut(**random.choice(_quotes()))
