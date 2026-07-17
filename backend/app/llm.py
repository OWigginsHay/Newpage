"""OpenAI chat-completion interface — the only module that imports ``openai``.

``agents`` depends on the *normalised* shape returned here, never on the SDK, so
swapping in Anthropic or Ollama later means changing just this file (and pairing
it with ``tool_schema.to_anthropic``).
"""
from __future__ import annotations

import json
from typing import Any

from .config import settings

# Runtime credentials — can be set from the UI (POST /config) instead of, or on
# top of, the .env values. Never persisted server-side.
_runtime: dict[str, str | None] = {"api_key": None, "model": None, "reasoning": None}
_client: Any = None


def set_credentials(
    api_key: str | None = None, model: str | None = None, reasoning: str | None = None
) -> None:
    """Override the API key / model / reasoning at runtime (e.g. from the UI)."""
    global _client
    if api_key is not None:
        _runtime["api_key"] = api_key or None
        _client = None  # force the client to rebuild with the new key
    if model is not None:
        _runtime["model"] = model or None
    if reasoning is not None:
        _runtime["reasoning"] = reasoning or None


def _effective_key() -> str:
    return _runtime["api_key"] or settings.openai_api_key


def current_model() -> str:
    return _runtime["model"] or settings.openai_model


def current_reasoning() -> str:
    return _runtime["reasoning"] or settings.reasoning


# Model families that default reasoning ON (they need reasoning_effort managed).
_REASONING_PREFIXES = ("gpt-5", "o1", "o3", "o4", "o5")


def _is_reasoning_model(model: str) -> bool:
    return (model or "").lower().startswith(_REASONING_PREFIXES)


def is_configured() -> bool:
    return bool(_effective_key())


def _get_client() -> Any:
    global _client
    if _client is None:
        from openai import OpenAI  # lazy: keep the core importable without openai

        key = _effective_key()
        if not key:
            raise RuntimeError("No OpenAI API key configured (set it in the UI or .env)")
        _client = OpenAI(api_key=key)
    return _client


def chat_completion(messages: list[dict], tools: list[dict] | None = None) -> dict:
    """Call the model and return a normalised reply.

    Returns ``{"content", "tool_calls": [{id, name, arguments(dict)}], "finish_reason"}``.
    """
    kwargs: dict[str, Any] = {
        "model": current_model(),
        "messages": messages,
        "tools": tools or None,
        "tool_choice": "auto" if tools else None,
    }
    # Reasoning models (gpt-5.x, o-series) default reasoning ON, and the
    # chat-completions endpoint refuses reasoning_effort together with function
    # tools. Our agent always uses tools, so we must *explicitly* set
    # reasoning_effort='none' for those models (omitting it leaves the default
    # on). Non-reasoning models (e.g. gpt-4o-mini) don't accept the param, so we
    # omit it there. True reasoning + tools would need the Responses API.
    reasoning = current_reasoning() or "none"
    if _is_reasoning_model(current_model()):
        kwargs["reasoning_effort"] = "none" if tools else reasoning

    try:
        response = _get_client().chat.completions.create(**kwargs)
    except Exception as exc:  # safety net for any model we didn't classify
        if "reasoning_effort" in str(exc) and kwargs.get("reasoning_effort") != "none":
            kwargs["reasoning_effort"] = "none"
            response = _get_client().chat.completions.create(**kwargs)
        else:
            raise
    return normalise(response)


def normalise(response: Any) -> dict:
    """Collapse a vendor response into the one shape ``agents`` understands."""
    message = response.choices[0].message
    tool_calls = []
    for call in getattr(message, "tool_calls", None) or []:
        try:
            arguments = json.loads(call.function.arguments or "{}")
        except json.JSONDecodeError:
            arguments = {}
        tool_calls.append(
            {"id": call.id, "name": call.function.name, "arguments": arguments}
        )
    return {
        "content": message.content,
        "tool_calls": tool_calls,
        "finish_reason": response.choices[0].finish_reason,
    }
