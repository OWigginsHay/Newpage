# OCR assessment — Project Meridian pharma package

Evaluation of the system's image + PDF OCR against the supplied
`GROUND-TRUTH-OCR-reference.txt` (fictional "NPX-2137" drug-discovery package).

## Setup

- **Engine:** EasyOCR, running on the local **GPU** (CUDA detected). Falls back to
  RapidOCR (CPU) then Tesseract if EasyOCR is absent — see [ocr.py](../backend/app/ocr.py).
- **Added image-file support** to ingestion (`.png/.jpg/.webp/…`): the image is
  OCR'd directly, chunked with citation metadata, embedded, and stored — same path
  as text/PDF. Scanned PDFs (no text layer) hit the existing OCR fallback.
- **Fixed a Windows bug:** EasyOCR's model-download progress bar prints a `█`
  (U+2588) that the cp1252 console can't encode, crashing `Reader()`. Resolved with
  `verbose=False`.

## Test 1 — Image OCR (`mechanism-of-action.png`, 3200×2000)

A clean, branded rendered graphic: title, subtitle, two 5-step mechanism lanes,
and a footer stat strip. OCR completed in ~1s on GPU (after a one-off model load).

| Ground-truth item | Captured? | Notes |
|---|---|---|
| Eyebrow "MECHANISM OF ACTION" | ✅ | read as "AcTION" (case) |
| Title "Synthetic lethality — NPX-2137 in MSI-high tumors" | ✅ | em-dash dropped |
| Subtitle (full sentence) | ✅ | verbatim |
| All 10 lane cells (labels + prose) | ✅ | text correct; multi-column **reading order scrambled** |
| **42 nM** — WRN ATPase IC50 | ✅ | value correct; "IC₅₀" → "ICso" |
| **>90×** — MSS selectivity window | ✅ | "×" → "*" |
| **82%** — xenograft TGI | ✅ | exact |
| "IC₅₀ 42 nM" inside a lane card | ✅ | subscript again → "so" |
| Footer attribution line | ✅ | verbatim |

**Every headline number was captured** — including the values that live *inside the
figure*, which the ground truth flagged as the hard case.

### Recurring error modes
1. **Subscripts** — "IC₅₀" → "ICso" (the ₅₀ is misread). The number 42 is fine; only
   the subscripted "50" in the *label* is affected.
2. **Special glyphs** — em-dash "—" → "F"/"\_"/dropped; multiplication "×" → "*".
3. **Reading order** — for the two-lane grid, lines come back roughly by position,
   not strictly left-to-right per lane. Content is all present; sequence isn't.
4. Minor casing ("ACTION" → "AcTION").

None of these lose a fact or a number — they're cosmetic/structural.

## Test 2 — Scanned-PDF OCR fallback

Wrapped the PNG into an **image-only PDF** (0 text-layer chars, 1 image) to force the
scanned-page path. Ingestion detected "no text + has image" → rasterised at 200 dpi
→ OCR'd → 2 chunks, text identical to Test 1. The born-digital vs scanned routing
works as designed.

## Test 3 — End-to-end retrieval

Query: *"MSS selectivity window and xenograft tumor growth inhibition for the drug?"*
Top retrieved chunks were the OCR'd `mechanism-scanned.pdf` and
`mechanism-of-action.png` (well above unrelated docs), and the footer-stat chunks
(containing ">90×" and "82%") were retrieved too. So OCR'd image content is indexed
and answerable through RAG.

## Verdict

- **Image OCR: strong** on clean rendered/graphic text. 100% of critical numbers,
  ~95%+ of all text; errors confined to subscripts, a few symbols, and column
  reading-order.
- **PDF OCR: works** — text-first for born-digital, OCR fallback for scanned/image
  pages, same engine.
- **Good enough for RAG** — retrieval finds the right passages and the numbers are
  intact, which is what matters for question-answering.

### Where it would struggle (not in this sample)
Handwriting, low-DPI scans, dense tables (cell structure is lost — OCR returns a
flat token stream), rotated/skewed pages, and heavy math notation.

### Improvements worth making
- **Layout-aware extraction** (e.g. Docling, or EasyOCR with paragraph+bbox
  post-processing) to preserve reading order and table structure.
- **Normalise glyphs** post-OCR (× , —, subscript digits) with a small cleanup map.
- **Born-digital PDFs first:** the three `.dc.html` docs are meant to be *exported to
  PDF*; those would extract via the PyMuPDF text layer (perfect fidelity) and never
  need OCR. HTML ingestion isn't wired yet — a small add if wanted.
- **Vector metric:** the collection uses L2 distance; for our normalised embeddings,
  switching to cosine would make the reported similarity scores cleaner (ranking is
  already correct).

## Files
Package copied to `sample-data/pharma-meridian/`. The mechanism image and the
scanned PDF are now in the index (visible in the Documents drawer).
