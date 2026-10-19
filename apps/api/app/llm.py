"""LLM + embedding providers. Chat can be Ollama, Anthropic or a fake (tests);
embeddings are always Ollama (Anthropic has no embeddings API) or fake."""

import hashlib
import math
import re
from functools import lru_cache
from typing import Protocol

import anthropic
import httpx

from app.config import settings

Message = dict[str, str]  # {"role": "user" | "assistant", "content": str}


class LLMError(RuntimeError):
    pass


class LLMProvider(Protocol):
    name: str

    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str: ...


class Embedder(Protocol):
    async def embed(self, texts: list[str]) -> list[list[float]]: ...


class OllamaProvider:
    name = "ollama"

    def __init__(self, url: str, model: str):
        self.url, self.model = url.rstrip("/"), model

    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str:
        body = {
            "model": self.model,
            "stream": False,
            "messages": [{"role": "system", "content": system}, *messages],
        }
        if json_mode:
            body["format"] = "json"
        try:
            async with httpx.AsyncClient(timeout=300) as client:
                r = await client.post(f"{self.url}/api/chat", json=body)
                r.raise_for_status()
        except httpx.HTTPError as e:
            raise LLMError(f"Ollama unavailable at {self.url}: {e}") from e
        return r.json()["message"]["content"]


class OllamaEmbedder:
    def __init__(self, url: str, model: str):
        self.url, self.model = url.rstrip("/"), model

    async def embed(self, texts: list[str]) -> list[list[float]]:
        try:
            async with httpx.AsyncClient(timeout=300) as client:
                r = await client.post(
                    f"{self.url}/api/embed", json={"model": self.model, "input": texts}
                )
                r.raise_for_status()
        except httpx.HTTPError as e:
            raise LLMError(f"Ollama embeddings unavailable at {self.url}: {e}") from e
        return r.json()["embeddings"]


class AnthropicProvider:
    name = "anthropic"

    def __init__(self, api_key: str, model: str):
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.model = model

    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str:
        if json_mode:
            system += "\n\nRespond with a single valid JSON object and nothing else."
        try:
            response = await self.client.beta.messages.create(
                model=self.model,
                max_tokens=16000,
                system=system,
                messages=messages,
                output_config={"effort": "low"},  # tutoring/summaries don't need deep thinking
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
            )
        except anthropic.APIError as e:
            raise LLMError(f"Claude API error: {e}") from e
        if response.stop_reason == "refusal":
            raise LLMError("Claude declined this request.")
        return "".join(b.text for b in response.content if b.type == "text")


class FakeProvider:
    """Deterministic provider for tests/CI: echoes the cited sources from the context."""

    name = "fake"

    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str:
        if json_mode:
            return (
                '{"questions": [{"question": "What does this session cover?", '
                '"options": ["A", "B", "C", "D"], "answer": 0, "explanation": "Fake quiz."}]}'
            )
        cited = sorted(set(re.findall(r"\[(\d+)\]", system)), key=int)
        refs = " ".join(f"[{n}]" for n in cited)
        return f"Fake answer to: {messages[-1]['content']} {refs}".strip()


class FakeEmbedder:
    """Bag-of-words hashing embedder: same words → similar vectors. Good enough for tests."""

    async def embed(self, texts: list[str]) -> list[list[float]]:
        out = []
        for text in texts:
            v = [0.0] * settings.embed_dim
            for word in re.findall(r"[a-z0-9]+", text.lower()):
                v[int(hashlib.md5(word.encode()).hexdigest(), 16) % settings.embed_dim] += 1
            norm = math.sqrt(sum(x * x for x in v)) or 1.0
            out.append([x / norm for x in v])
        return out


def provider_name() -> str:
    return settings.llm_provider or ("anthropic" if settings.anthropic_api_key else "ollama")


@lru_cache
def get_llm() -> LLMProvider:
    match provider_name():
        case "anthropic":
            return AnthropicProvider(settings.anthropic_api_key, settings.anthropic_model)
        case "fake":
            return FakeProvider()
        case _:
            return OllamaProvider(settings.ollama_url, settings.ollama_chat_model)


@lru_cache
def get_embedder() -> Embedder:
    if provider_name() == "fake":
        return FakeEmbedder()
    return OllamaEmbedder(settings.ollama_url, settings.ollama_embed_model)
