"""Conversation state + the agent tool-call loop. Imported by ``main`` (FastAPI).

Exposes exactly the names the API layer expects: ``send_chat``, ``get_chats``,
``get_conversation_history``, ``get_tool_schema``.
"""
from __future__ import annotations

import json
import uuid
from typing import Any

from . import llm
from .config import settings
from .registry import dispatch, get_functions
from .tool_schema import to_openai

# In-memory conversation store; swap for sqlite/redis to persist across restarts.
CONVERSATIONS: dict[str, list[dict]] = {}

SYSTEM_PROMPT = (
    "You are a document-grounded assistant for the user's collection. "
    "Answer using the query_rag, search_keyword and read_file tools rather than "
    "prior knowledge. If the tools surface nothing relevant, say you don't know "
    "instead of guessing. Cite the sources (file and page) you relied on."
)


def get_chats() -> list[str]:
    return list(CONVERSATIONS.keys())


def get_conversation_history(conv_id: str) -> list[dict]:
    return CONVERSATIONS.get(conv_id, [])


def get_tool_schema() -> list[dict]:
    """Advertise every registered tool to the model, in OpenAI's envelope."""
    return [to_openai(fn) for fn in get_functions()]


def send_chat(user_message: str, conv_id: str | None = None) -> dict:
    """Run one user turn to completion, letting the model call tools as needed."""
    conv_id, history = _get_or_create(conv_id)
    history.append({"role": "user", "content": user_message})

    tools = get_tool_schema()
    citations: list[dict] = []
    steps: list[dict] = []  # a trace of the tools the agent ran, for the UI

    for _ in range(settings.max_tool_iterations):
        reply = llm.chat_completion(history, tools=tools)

        if reply["tool_calls"]:
            history.append(
                {
                    "role": "assistant",
                    "content": reply["content"],
                    "tool_calls": _to_openai_tool_calls(reply["tool_calls"]),
                }
            )
            for call in reply["tool_calls"]:
                result_text, sources = _run_tool(call["name"], call["arguments"])
                citations.extend(sources)
                steps.append(
                    {
                        "tool": call["name"],
                        "args": call["arguments"],
                        "count": len(sources) if sources else None,
                        "ok": not result_text.startswith("ERROR"),
                    }
                )
                history.append(
                    {
                        "role": "tool",
                        "tool_call_id": call["id"],
                        "content": result_text,
                    }
                )
            continue  # loop so the model can read the tool output

        history.append({"role": "assistant", "content": reply["content"]})
        return {
            "conversation_id": conv_id,
            "answer": reply["content"],
            "citations": _dedupe(citations),
            "steps": steps,
        }

    return {
        "conversation_id": conv_id,
        "answer": "I wasn't able to finish within the tool-call limit.",
        "citations": _dedupe(citations),
        "steps": steps,
    }


# --- internals ------------------------------------------------------------


def _get_or_create(conv_id: str | None) -> tuple[str, list[dict]]:
    """Return ``(conversation_id, history)``, creating a new conversation if needed."""
    if conv_id and conv_id in CONVERSATIONS:
        return conv_id, CONVERSATIONS[conv_id]
    new_id = conv_id or uuid.uuid4().hex
    history = [{"role": "system", "content": SYSTEM_PROMPT}]
    CONVERSATIONS[new_id] = history
    return new_id, history


def _run_tool(name: str, arguments: dict) -> tuple[str, list[dict]]:
    """Dispatch a tool call; separate its text (for the model) from citations."""
    try:
        result = dispatch(name, arguments)
    except Exception as exc:  # tools should degrade, not crash the loop
        return f"ERROR running {name}: {exc}", []

    # Retrieval tools return {"text": ..., "chunks": [{source, page, ...}]}.
    if isinstance(result, dict) and "chunks" in result:
        return result.get("text", ""), list(result.get("chunks", []))
    return str(result), []


def _to_openai_tool_calls(tool_calls: list[dict]) -> list[dict]:
    """Re-serialise normalised calls into the assistant-message shape the API needs."""
    return [
        {
            "id": call["id"],
            "type": "function",
            "function": {
                "name": call["name"],
                "arguments": json.dumps(call["arguments"]),
            },
        }
        for call in tool_calls
    ]


def _dedupe(citations: list[dict]) -> list[dict]:
    seen: set[tuple[Any, Any]] = set()
    out: list[dict] = []
    for citation in citations:
        key = (citation.get("source"), citation.get("page"))
        if key not in seen:
            seen.add(key)
            out.append(citation)
    return out
