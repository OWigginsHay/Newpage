# System Requirements for option 1 

## Context & Background

Option 1: Chat With Your Docs

Build a system that answers questions about content from a document collection (PDFs, text files, or any format you choose). This is the same classic RAG use-case you might be familiar with.

---

## Systems

- Document Ingestion and Embedding
- Tool Schema Creation - (Don't tie ourselves into the OpenAI Agents SDK, Consider Dynamic PyDantic Scheme Generation)
- Chat & Convsersation State Management System

---

## Document Ingestion and Embedding

GOAL: Take a set of path(s) to folders and or files. Read and chunk those files and store references along with vector embeddings. Provide a layer to query the embedded chunks and optionally insert a questioning LLM branch before the query. 

"Tell me about the cloud infra" - #1 Chunk, #2 Chunk, #3 Chunk

"Tell me about the cloud infra" - "What cloud provider is used", "Are any APIs created", "Are any databases created" - 1,2,3,4,5,6,7,8,9

---

## Tool Schema Creation

GOAL: Look at the signautre of defined tools(functions), dynamically create the tool schema *Compatible with both OpenAI and Anthropic*

Pydantic - Json w/ inspect python module. 

## Chat & Convsersation State Management System

GOAL: To accurately track the user/tool/assistant messages, and call the relevant LLM APIs on user input. 

---

## Tech Stack

VectorDB - ChromaDB
LLMs - APIs Directly or Ollama
Embeddings - HFSentenceTransformerV2 (Transformers)
STT - *Research*
File Processing - Mix + OCR (Textract equivelent opensource on HF?)
UI - REACT

---

## Visuals 

Design System w/ Claude Code Design ($)
Use the Newpage logo - Yellow, Blue, White 
Saved an SVG to the folder

---

## Guidance to the LLM Agent on First Pass

- Create the REACT app and move the SVG to assets. 
- Conduct a small online research for free, locally runnable alternatives to ChromaDB with pros and cons
- Conduct a small online research for free, locally runnable alternatives to Textract (OCR) with pros and cons
