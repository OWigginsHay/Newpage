"""Chat With Your Docs — backend package.

Module map (mirrors pseudocode/):
  registry     — @tool decorator + TOOL_REGISTRY + dispatch  (name -> callable)
  tools        — the agent's capabilities (read_file, search_keyword, query_rag)
  tool_schema  — signature/Pydantic introspection -> JSON schema (OpenAI/Anthropic)
  llm          — OpenAI chat-completion interface (the only vendor import)
  agents       — conversation state + the tool-call loop
  chunking     — pure text -> overlapping chunks with citation metadata
  ingestion    — extract (text + OCR fallback) -> chunk -> embed -> Chroma
  embeddings   — sentence-transformers wrapper (lazy)
  vector_store — ChromaDB wrapper (lazy)
  main         — FastAPI app
"""
