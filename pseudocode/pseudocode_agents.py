from pseudocode_tools import TOOL_REGISTRY   # {name: func}, filled by the @tool decorator
from pseudocode_tool_schema import function_schema, get_functions
from pseudocode_openai_api import chat_completion

# Conversation state + the agent loop. This is what fastapi.py imports.
# In-memory for the demo; swap CONVERSATIONS for sqlite/redis later.
CONVERSATIONS = {}   # { conv_id: [ {role, content, ...}, ... ] }

SYSTEM_PROMPT = """
You answer questions about the user's documents.
Ground every answer with query_rag / search_keyword / read_file.
If the tools surface nothing relevant, say you don't know. Always cite sources.
"""


def get_chats():
    return list(CONVERSATIONS.keys())

def get_conversation_history(conv_id):
    return CONVERSATIONS.get(conv_id, [])

def get_tool_schema():
    # built once from the @tool functions -> passed to the model each turn
    return [function_schema(f) for f in get_functions()]


def send_chat(conv_id, user_message):
    history = CONVERSATIONS.setdefault(conv_id, [{"role": "system", "content": SYSTEM_PROMPT}])
    history.append({"role": "user", "content": user_message})
    tools = get_tool_schema()
    citations = []

    while True:  # keep looping while the model wants to call tools
        reply = chat_completion(history, tools=tools)

        if reply["tool_calls"]:
            history.append({"role": "assistant", "tool_calls": reply["tool_calls"]})
            for call in reply["tool_calls"]:
                result, sources = dispatch_tool(call["name"], call["arguments"])
                citations += sources
                history.append({"role": "tool", "tool_call_id": call["id"], "content": result})
            continue  # loop back so the model can read the tool output

        history.append({"role": "assistant", "content": reply["content"]})
        return {"answer": reply["content"], "citations": dedupe(citations)}


def dispatch_tool(name, arguments):
    func = TOOL_REGISTRY[name]          # the actual @tool function in tools.py
    result = func(**arguments)
    # query_rag / search_keyword return chunks carrying {source, page, offsets}
    # -> that metadata IS the citation trail
    sources = [chunk.metadata for chunk in result.chunks] if has_chunks(result) else []
    return stringify(result), sources
