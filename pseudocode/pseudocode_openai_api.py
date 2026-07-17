import openai
import os
import json

# The one place that knows the vendor. agents.py calls THIS, never openai
# directly -> single swap-in point for Anthropic / Ollama later. The tool
# schemas already arrive in the right envelope from tool_schema.py.

client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
MODEL = "gpt-..."


def chat_completion(messages, tools=None):
    # messages = [{role, content}, ...]   roles: system / user / assistant / tool
    # tools    = [schema, ...] from tool_schema.function_schema()
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=tools,
        tool_choice="auto",
    )
    return normalise(response)


def normalise(response):
    # collapse the vendor reply into ONE shape agents.py understands, so the
    # loop doesn't care whose API answered:
    #   { content, tool_calls: [{id, name, arguments(dict)}], finish_reason }
    msg = response.choices[0].message
    tool_calls = []
    for call in msg.tool_calls or []:
        tool_calls.append({
            "id": call.id,
            "name": call.function.name,
            "arguments": json.loads(call.function.arguments),  # str -> dict
        })
    return {
        "content": msg.content,
        "tool_calls": tool_calls,
        "finish_reason": response.choices[0].finish_reason,
    }


def stream_completion(messages, tools=None):
    # optional: same call, stream=True, yield tokens to the UI as they arrive
    ...
