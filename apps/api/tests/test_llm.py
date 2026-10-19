from app import llm
from app.config import settings


def test_provider_selection(monkeypatch):
    monkeypatch.setattr(settings, "llm_provider", "")
    monkeypatch.setattr(settings, "anthropic_api_key", "")
    assert llm.provider_name() == "ollama"
    monkeypatch.setattr(settings, "anthropic_api_key", "sk-test")
    assert llm.provider_name() == "anthropic"
    monkeypatch.setattr(settings, "llm_provider", "ollama")
    assert llm.provider_name() == "ollama"  # explicit choice wins over a present key
