# Cloud architecture (productionisation) — (AI GEN)

> A naive, provider-agnostic sketch of how the local app would map onto a
> hyperscaler. AWS service names are given as examples; GCP/Azure/Cloudflare
> equivalents apply. This is the "what it would take to scale it" answer, not a
> built artifact. A rendered diagram can live alongside this file as a `.jpg`.

```
                        ┌───────────────────────────┐
        Users ─────────▶│  CDN + static hosting     │   React build (Vite)
                        │  (CloudFront / CF Pages)   │   served as static assets
                        └────────────┬──────────────┘
                                     │ HTTPS (API calls)
                             ┌───────▼────────┐
                             │  Auth / edge   │  Cognito / Auth0, WAF, rate-limit
                             └───────┬────────┘
                                     │
                        ┌────────────▼─────────────┐
                        │  API (FastAPI containers)│  ECS Fargate / Cloud Run / K8s
                        │  autoscaled, stateless   │  — the agent loop + tool dispatch
                        └───┬─────────┬─────────┬──┘
            chat / tools    │         │ ingest  │ retrieval
                            │         │ (async) │
           ┌────────────────▼──┐  ┌───▼──────┐  │   ┌──────────────────────┐
           │  LLM provider     │  │  Queue    │  └──▶│  Vector DB (managed)  │
           │  OpenAI / self-   │  │ (SQS) +   │      │  pgvector / Qdrant /  │
           │  hosted vLLM      │  │ workers   │      │  managed Chroma       │
           └───────────────────┘  └───┬───────┘      └──────────▲───────────┘
                                      │ chunk/OCR/embed          │ upsert
                        ┌─────────────▼───────────┐   ┌──────────┴───────────┐
                        │  Object storage (S3)    │   │  Embedding service    │
                        │  raw uploaded documents  │   │  GPU endpoint /       │
                        └──────────────────────────┘   │  embeddings API       │
                                                       └──────────────────────┘

  Cross-cutting: Secrets Manager (API keys) · OpenTelemetry/Langfuse (traces,
  token usage, retrieval quality) · CloudWatch (logs/metrics) · IaC (Terraform).
```

## What changes vs the local app

| Concern | Local (now) | Cloud |
|---|---|---|
| Frontend | Vite dev server | Static build on CDN |
| API | single uvicorn process | autoscaled stateless containers behind a load balancer |
| Conversation state | in-memory dict | Redis / a database (so any container can serve any turn) |
| Uploads | a path on disk | object storage (S3), presigned uploads |
| Ingestion | synchronous in the request | async queue + workers (chunk, OCR, embed) so big/slow files don't block |
| Vector store | embedded ChromaDB file | managed vector DB (pgvector/Qdrant/Chroma Cloud) |
| Embeddings | local sentence-transformers on the dev GPU | a dedicated GPU inference endpoint (or an embeddings API) |
| Secrets | UI-entered key in a local `.env` | Secrets Manager; per-user keys or a pooled org key |
| Auth | none (single user) | Cognito/Auth0 + per-user document scoping |
| Observability | tool-use pips + logs | distributed tracing, token/cost dashboards, retrieval-quality evals |

## Notes
- The API stays **stateless** so it scales horizontally; the only stateful pieces
  are the vector DB, object storage, and the conversation store.
- **Ingestion is the part that most needs to move off the request path** — OCR and
  embedding are CPU/GPU-heavy and bursty, so a queue + worker pool is the first
  real-world change.
- Keeping the LLM behind a single `llm.py` seam (as in the local app) means the
  cloud version can swap OpenAI for a self-hosted model without touching the agent.
