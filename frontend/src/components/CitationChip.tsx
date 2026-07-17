import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api, type ChunkContext, type Citation } from "../api";
import { ChunkContextView } from "./ChunkContextView";

function fileName(path?: string): string {
  return path ? path.split(/[\\/]/).pop() || path : "source";
}

// Module-level cache so re-hovering the same citation is instant.
const contextCache = new Map<string, ChunkContext>();

/**
 * Citation chip that, on hover/focus, shows a floating card with the cited
 * chunk highlighted inside its surrounding document text.
 */
export function CitationChip({ citation }: { citation: Citation }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ctx, setCtx] = useState<ChunkContext | null>(null);

  const cacheKey = `${citation.source}|${citation.start}|${citation.end}`;
  const pageLabel =
    typeof citation.page === "number" && citation.page > 0 ? ` · p${citation.page}` : "";

  const show = useCallback(async () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const half = 210; // keep the ~420px card within the viewport
      const centre = Math.min(
        Math.max(rect.left + rect.width / 2, half + 8),
        window.innerWidth - half - 8,
      );
      setPos({ top: rect.top, left: centre });
    }
    setOpen(true);

    if (contextCache.has(cacheKey)) {
      setCtx(contextCache.get(cacheKey) ?? null);
      return;
    }
    if (
      citation.source != null &&
      typeof citation.start === "number" &&
      typeof citation.end === "number"
    ) {
      try {
        const loaded = await api.chunkContext(
          citation.source,
          citation.start,
          citation.end,
          citation.page,
        );
        contextCache.set(cacheKey, loaded);
        setCtx(loaded);
      } catch {
        /* keep the fallback (citation.text) */
      }
    }
  }, [cacheKey, citation]);

  return (
    <button
      ref={ref}
      type="button"
      className="cite"
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={() => setOpen(false)}
    >
      {fileName(citation.source)}
      {pageLabel}

      {open &&
        createPortal(
          <div
            className="cite-pop"
            style={{ top: pos.top, left: pos.left }}
            role="tooltip"
          >
            <div className="cite-pop__head">
              {fileName(citation.source)}
              {pageLabel}
            </div>
            <ChunkContextView
              ctx={ctx}
              fallbackText={typeof citation.text === "string" ? citation.text : undefined}
              compact
            />
            <div className="cite-pop__path" title={citation.source}>
              {citation.source}
            </div>
          </div>,
          document.body,
        )}
    </button>
  );
}
