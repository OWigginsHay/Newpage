"""Generate JSON-Schema tool definitions from plain Python functions.

Two sources, matching the architecture sketch:

* if a parameter is annotated with a **Pydantic** ``BaseModel`` we defer to its
  ``model_json_schema()``;
* otherwise we map the **inspected signature** through ``_TYPE_LOOKUP``, recursing
  into ``list`` / ``dict`` generics and unwrapping ``Optional`` / ``Union``.

Per-parameter descriptions come from ``typing.Annotated[T, "desc"]``; the tool
description is the function's docstring. ``required`` = parameters without a
default.

``to_openai`` / ``to_anthropic`` wrap the identical core schema in each vendor's
envelope — the single provider-agnostic seam.
"""
from __future__ import annotations

import inspect
import types
import typing
from enum import Enum
from typing import Any, Callable, get_args, get_origin

try:  # pydantic is present in this project, but keep schema-gen importable without it
    from pydantic import BaseModel
except Exception:  # pragma: no cover
    BaseModel = None  # type: ignore[assignment, misc]

_TYPE_LOOKUP: dict[Any, str] = {
    str: "string",
    int: "integer",
    float: "number",
    bool: "boolean",
    dict: "object",
    list: "array",
    type(None): "null",
}

_UNION_TYPES = {typing.Union}
if hasattr(types, "UnionType"):  # PEP 604 `X | Y`, Python 3.10+
    _UNION_TYPES.add(types.UnionType)


def _is_pydantic_model(tp: Any) -> bool:
    return BaseModel is not None and isinstance(tp, type) and issubclass(tp, BaseModel)


def python_type_to_schema(annotation: Any) -> dict:
    """Map a single Python type annotation to a JSON-Schema fragment."""
    description: str | None = None

    # Annotated[T, "desc", ...] -> unwrap to T, capture the first string as a description
    if hasattr(annotation, "__metadata__"):
        args = get_args(annotation)
        description = next((m for m in args[1:] if isinstance(m, str)), None)
        annotation = args[0]

    if annotation is inspect.Parameter.empty or annotation is Any:
        schema: dict = {}  # unconstrained
    elif _is_pydantic_model(annotation):
        schema = annotation.model_json_schema()
    elif isinstance(annotation, type) and issubclass(annotation, Enum):
        schema = {"type": "string", "enum": [e.value for e in annotation]}
    else:
        origin = get_origin(annotation)
        if origin in (list, set, frozenset, tuple):
            item_args = get_args(annotation)
            item_type = item_args[0] if item_args else Any
            schema = {"type": "array", "items": python_type_to_schema(item_type)}
        elif origin is dict:
            args = get_args(annotation)
            value_type = args[1] if len(args) == 2 else Any
            schema = {
                "type": "object",
                "additionalProperties": python_type_to_schema(value_type),
            }
        elif origin in _UNION_TYPES:
            members = [a for a in get_args(annotation) if a is not type(None)]
            if len(members) == 1:  # Optional[T]
                schema = python_type_to_schema(members[0])
            else:
                schema = {"anyOf": [python_type_to_schema(m) for m in members]}
        else:
            schema = {"type": _TYPE_LOOKUP.get(annotation, "string")}

    if description:
        schema = {**schema, "description": description}
    return schema


def function_schema(func: Callable) -> dict:
    """The provider-neutral core schema for one tool: name, description, parameters."""
    hints = typing.get_type_hints(func, include_extras=True)
    sig = inspect.signature(func)

    properties: dict[str, dict] = {}
    required: list[str] = []
    for name, param in sig.parameters.items():
        if name in ("self", "cls"):
            continue
        if param.kind in (param.VAR_POSITIONAL, param.VAR_KEYWORD):
            continue
        annotation = hints.get(name, param.annotation)
        properties[name] = python_type_to_schema(annotation)
        if param.default is inspect.Parameter.empty:
            required.append(name)

    doc = (inspect.getdoc(func) or "").strip()
    return {
        "name": func.__name__,
        "description": doc.split("\n\n")[0] if doc else "",
        "parameters": {
            "type": "object",
            "properties": properties,
            "required": required,
        },
    }


def to_openai(func: Callable) -> dict:
    """OpenAI tool envelope: {"type": "function", "function": {...}}."""
    return {"type": "function", "function": function_schema(func)}


def to_anthropic(func: Callable) -> dict:
    """Anthropic tool envelope: {"name", "description", "input_schema"}."""
    core = function_schema(func)
    return {
        "name": core["name"],
        "description": core["description"],
        "input_schema": core["parameters"],
    }
