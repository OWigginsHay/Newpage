"""The tool registry — the reference from a tool *name* back to the executable
method, which is the piece the pseudocode was missing.

`@tool` records each function in ``TOOL_REGISTRY``. Two consumers read that one
dict, in opposite directions:

* ``tool_schema`` reads it to *describe* the tools to the LLM, and
* ``dispatch`` reads it to *run* the tool the LLM chose.

Keeping both directions keyed off the same registry means a tool can never be
advertised to the model without also being callable, or vice versa.
"""
from __future__ import annotations

from typing import Any, Callable

ToolFn = Callable[..., Any]

TOOL_REGISTRY: dict[str, ToolFn] = {}


def tool(func: ToolFn) -> ToolFn:
    """Register ``func`` as an agent-callable tool, keyed by its name."""
    name = func.__name__
    existing = TOOL_REGISTRY.get(name)
    if existing is not None and existing is not func:
        raise ValueError(f"Duplicate tool name registered: {name!r}")
    func.__is_tool__ = True  # type: ignore[attr-defined]
    TOOL_REGISTRY[name] = func
    return func


def get_functions() -> list[ToolFn]:
    """All registered tool functions (source for schema generation)."""
    return list(TOOL_REGISTRY.values())


def dispatch(name: str, arguments: dict[str, Any] | None = None) -> Any:
    """Look up a registered tool by name and invoke it with keyword args."""
    if name not in TOOL_REGISTRY:
        raise KeyError(f"Unknown tool: {name!r}")
    return TOOL_REGISTRY[name](**(arguments or {}))
