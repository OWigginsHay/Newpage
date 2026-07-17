# OCR / Textract alternatives (free, local, open-source)

Research for document ingestion in "Chat With Your Docs". Question: what free, **locally-runnable, open-source** tools replace AWS Textract (a paid cloud service) for extracting text from PDFs/images, usable from **Python on Windows (likely CPU-only)**?

> TL;DR — **Most PDFs are born-digital: extract embedded text first, and only fall back to true OCR for pages that are actually scanned images.** Simplest good-enough default: **Docling** (one pip install, local, handles both layers, RAG-oriented Markdown/JSON output). Hand-rolled default: **PyMuPDF → RapidOCR → pdfplumber** (text / OCR fallback / tables).

Two layers matter — don't OCR a PDF that already has a text layer.

## Layer 1 — Born-digital PDF text + layout

| Tool | How it runs | Pros | Cons / gotchas | License |
|---|---|---|---|---|
| **PyMuPDF (`fitz`)** | Pip binary wheel, no system deps. CPU. | Fastest extractor; span-level font/coords; renders pages to feed OCR. Trivial Windows install. | Weaker table extraction. **AGPL-3.0** taints closed-source distribution. | AGPL-3.0 or paid |
| **pdfplumber** | Pure-Python (`pdfminer.six`). CPU. | Best-in-class **table extraction** + word/char coords. Permissive. | Slow; no OCR; struggles on complex/rotated layouts. | MIT |
| **pypdf** | Pure-Python, zero deps. CPU. | Lightweight; good for merge/split/metadata + quick text. | Weakest fidelity; no tables/layout; no OCR. | BSD |
| **Unstructured** | Pip lib; local inference optional. | One API across PDF/HTML/DOCX…; layout + table; RAG chunking helpers. Apache-2.0. | Heavy/fragile deps; local models pull big extras; some features steer to their cloud. | Apache-2.0 |
| **Docling (IBM)** | Pip lib, **fully local**, CPU or GPU. | Layout, reading order, tables, formulas, code; **built-in OCR** (wraps Tesseract/EasyOCR/RapidOCR); optional tiny VLM (Granite-Docling-258M); Markdown/JSON out. RAG-oriented. | First run downloads models; CPU slower than raw text pull; more moving parts. | MIT (code) |
| **Marker** | Pip; DL PDF→Markdown; **GPU recommended**. | Very high-quality Markdown, tables, equations. | **GPL-3.0** + revenue-capped model weights; slow on CPU. | GPL-3.0 + restricted weights |
| **LlamaParse** | **Not local** — hosted cloud API. | Strong parsing, minimal setup. | Sends docs to the cloud → **disqualified** for local-first/private RAG. | Proprietary SaaS |

## Layer 2 — True OCR for scanned / image pages

| Tool | How it runs | Pros | Cons / gotchas | License |
|---|---|---|---|---|
| **Tesseract (`pytesseract`)** | Wraps the **Tesseract system binary** (UB-Mannheim build on Windows). CPU. | Mature; 100+ languages; light; good on clean scans. | Needs external binary + PATH; weak on noisy scans/handwriting; no layout/table logic. | Apache-2.0 |
| **RapidOCR** | **Pip-only** ONNX runtime of PaddleOCR models. **No system binary, CPU-first.** | PaddleOCR-level accuracy with a clean `pip install`; smoothest Windows/CPU OCR; a Docling backend. | Fewer features than full PaddleOCR; basic layout/table. | Apache-2.0 |
| **PaddleOCR** | Pip (`paddlepaddle` + `paddleocr`). CPU/GPU. | Top-tier accuracy; strong layout + tables + 80+ langs; VLM variant (PaddleOCR-VL). | `paddlepaddle` install finicky on Windows; GPU for best speed. | Apache-2.0 |
| **EasyOCR** | Pip on PyTorch. CPU works, GPU faster. | Very easy install; 80+ langs; robust on messy scans. | ~500 MB models; ~3× slower on CPU; known `$`/digit confusion; basic layout. | Apache-2.0 |
| **docTR (Mindee)** | Pip (TF or PyTorch). CPU/GPU. | Clean modular detection + recognition; good accuracy. | Pulls a full DL framework; limited layout/tables; GPU preferred. | Apache-2.0 |
| **Surya** | Pip; CPU (llama.cpp) or GPU (vLLM). | Strong layout-aware OCR, 90+ langs; math→LaTeX. | Model **weights** revenue-capped (OpenRAIL-M); heavier than plain OCR. | Apache-2.0 code / restricted weights |
| **TrOCR (Microsoft)** | HF `transformers`. GPU recommended. | High accuracy on line/word crops, incl. handwriting. | **Recognition only** — needs a separate text detector; slow on CPU. | MIT |
| **VLM extractors** (olmOCR-2, GOT-OCR2.0, Qwen2.5-VL, Granite-Docling-258M, PaddleOCR-VL) | HF/vLLM/Ollama VLMs: page image → structured text/Markdown. | Best on hard/low-quality/handwritten/table-dense pages; end-to-end. olmOCR-2 & GOT-OCR2.0 Apache-2.0. | 7B-class want a GPU; heavy on CPU. **Granite-Docling-258M** is tiny + CPU-runnable inside Docling. | Mostly Apache-2.0 |

## Recommended pipeline (route per page, not per document)

1. **Extract embedded text first** with **PyMuPDF** (fast). Most PDFs are born-digital.
2. **Detect scanned pages** — a page yielding near-zero characters (< ~20) but containing an image is treated as scanned.
3. **OCR only those pages** — rasterise with PyMuPDF, OCR with **RapidOCR** (pip-only, CPU-first, no system binary) — or Tesseract if the extra binary is acceptable.
4. **Tables** — extract table-heavy pages with **pdfplumber**.

**Simplest single default: Docling.** One pip install, fully local on CPU, handles born-digital *and* scanned pages (built-in OCR backends), extracts layout + tables + formulas, outputs Markdown/JSON that drops straight into a chunker. Start here; hand-roll the PyMuPDF + RapidOCR + pdfplumber pipeline only when you need finer control or want to avoid model downloads.

**License watch-outs:** PyMuPDF (AGPL-3.0 or paid — swap to pdfplumber/pypdf if shipping closed-source), Marker (GPL-3.0 + capped weights), Surya (capped weights), LlamaParse (cloud, not local). Safe/permissive: pdfplumber (MIT), pypdf (BSD), Docling (MIT), and Apache-2.0 for Unstructured/Tesseract/RapidOCR/PaddleOCR/EasyOCR/docTR/olmOCR-2/GOT-OCR2.0/Granite-Docling.

**GPU upgrade path:** if a GPU appears and you hit hard/handwritten scans, add a VLM extractor (olmOCR-2-7B or GOT-OCR2.0, both Apache-2.0) as a last-resort per-page fallback.
