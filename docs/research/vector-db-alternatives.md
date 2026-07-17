# Vector DB alternatives to ChromaDB (free, local)

Research for the "Chat With Your Docs" RAG system. Question: what free, **locally-runnable** vector databases could we use instead of (or alongside) ChromaDB, for a small single-user document-QA app on **Windows / Python**?

> TL;DR — **Keep ChromaDB as the default** for the demo. Hold **LanceDB** (fully embedded) and **Qdrant** (container, best upgrade path) as the two alternatives to graduate to. Avoid raw FAISS (index, not a store), sqlite-vss (deprecated), and Milvus/Weaviate full (too heavy). **Milvus Lite has no native Windows build** — WSL only.

## Comparison

| Option | How it runs locally | Metadata filter | Hybrid / keyword | Persistence | License | Fit for a small local RAG |
|---|---|---|---|---|---|---|
| **ChromaDB** (baseline) | Embedded in-process (`PersistentClient`) or local server/Docker | Yes (`where`) | Yes — vector + full-text + regex + metadata | Yes (SQLite-backed) | Apache-2.0 | **Strong default** — purpose-built for this |
| **Qdrant** | Embedded pure-Python **or** local Docker (real Rust engine) | Yes (rich payload filters) | Yes — dense + sparse/BM25, RRF/DBSF fusion (server) | Yes | Apache-2.0 | Best "grow past demo" path; ship on container |
| **LanceDB** | Embedded in-process, writes Lance files to disk | Yes (SQL-style) | Yes — vector + FTS + reranking | Yes (file, versioned) | Apache-2.0 | Excellent embedded choice; zero services |
| **Milvus Lite** | Embedded in-process (`MilvusClient("x.db")`) | Yes | Yes — sparse + BM25, hybrid | Yes (local file) | Apache-2.0 | Capable but **no native Windows** (needs WSL) |
| **Milvus** (full) | Local Docker/standalone (etcd/MinIO if distributed) | Yes | Yes | Yes | Apache-2.0 | Overkill at demo scale |
| **pgvector** | Postgres extension → local Postgres/Docker | Yes (native SQL `WHERE`/`JOIN`) | Yes — pair with Postgres FTS (`tsvector`) | Yes (Postgres) | PostgreSQL (permissive) | Great if Postgres is already in the stack |
| **sqlite-vec** | Embedded SQLite extension (pure C, no deps) | Yes (plain SQL columns) | Partial — join with FTS5 yourself | Yes (SQLite file) | Apache-2.0 / MIT | Smallest footprint; pre-v1 churn |
| **sqlite-vss** | SQLite extension (Faiss-backed) | Weak | No | Yes | MIT | **Deprecated — don't use** (see sqlite-vec) |
| **Weaviate** | Local Docker (primary); embedded mode Linux/macOS-only | Yes | Yes — native BM25 + vector (`alpha`) | Yes | BSD-3-Clause | Feature-rich but server-oriented, heavier |
| **FAISS** | Embedded **library**, not a DB | No (crude ID selectors only) | No | Manual save/load | MIT | Index engine — needs glue for metadata/docs |

## Notes per option

- **ChromaDB** — `PersistentClient(path=...)` gives zero-service local persistence on SQLite; also has client/server + Docker. Unifies vector + full-text + metadata filtering. Optimises for developer ergonomics over raw throughput; has historically had some breaking API/storage changes across versions. [docs](https://docs.trychroma.com/docs/querying-collections/metadata-filtering)
- **Qdrant** — Two local modes: pure-Python embedded (`:memory:`/path) for tests, or a single Docker container for the real Rust engine. Server mode does true hybrid (sparse + dense, RRF/DBSF). Embedded mode is a prototype reimplementation — ship demos on the container if you want hybrid/scale. [github](https://github.com/qdrant/qdrant), [hybrid](https://qdrant.tech/documentation/search/hybrid-queries/)
- **LanceDB** — Fully embedded, writes columnar Lance files — no server, fits "zero external services" perfectly. Vector + FTS + hybrid + reranking + dataset versioning. Younger ecosystem, fast-moving format/API. [github](https://github.com/lancedb/lancedb)
- **Milvus Lite** — `pip install pymilvus`, local `.db` path, API-compatible with full Milvus. **No native Windows** (Ubuntu ≥20.04 / macOS ≥11 only; WSL required); intended for <~1M vectors. [docs](https://milvus.io/docs/milvus_lite.md)
- **pgvector** — `vector` type in Postgres with HNSW/IVFFlat; metadata filtering is just SQL, hybrid = pgvector + Postgres FTS. Not embedded — you run a Postgres instance. [github](https://github.com/pgvector/pgvector)
- **sqlite-vec** — Tiny pure-C SQLite extension, runs anywhere SQLite does (incl. Windows/WASM); successor to sqlite-vss. Pre-v1 ("expect breaking changes"); mostly brute-force KNN today; assemble hybrid yourself. [github](https://github.com/asg017/sqlite-vec)
- **sqlite-vss** — Abandoned; author redirects to sqlite-vec. Skip. [github](https://github.com/asg017/sqlite-vss)
- **Weaviate** — First-class native hybrid (BM25 + vector via `alpha`); runs best as Docker; embedded mode experimental and Linux/macOS-only. Heavier than a single-user demo needs. [github](https://github.com/weaviate/weaviate)
- **FAISS** — A similarity-search *library*, not a database: no metadata store, no real filtering, manual persistence. Fast ANN engine but you bolt on your own doc/metadata storage. [github](https://github.com/facebookresearch/faiss)

## Recommendation

1. **ChromaDB (default).** Purpose-built for RAG, embeds in-process in one line, persists to a folder, does metadata + full-text filtering. Least code for a demo.
2. **LanceDB** — strongest alternative that keeps the "no server" property; reach for it for larger/multimodal data, columnar storage, or versioning.
3. **Qdrant** — best clean upgrade path from demo → real: prototype embedded, flip to one Docker container for the full engine + proper hybrid search, without changing databases.

Also worth a mention: **sqlite-vec** for the absolute smallest single-file footprint on Windows (accepting pre-v1 churn), and **pgvector** only if Postgres is already present. Avoid FAISS (glue-heavy), sqlite-vss (deprecated), and Milvus/Weaviate full (heavier than needed). **Milvus Lite is a poor fit on this Windows machine** (WSL required).
