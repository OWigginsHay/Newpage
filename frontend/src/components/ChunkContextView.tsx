import { useEffect, useRef } from "react";
import type { ChunkContext } from "../api";

interface ChunkContextViewProps {
  ctx: ChunkContext | null;
  fallbackText?: string;
  compact?: boolean;
}

/**
 * Renders a chunk highlighted within its surrounding document text
 * (before · <mark>chunk</mark> · after). Scrolls the highlight into view.
 * If no context is loaded yet, shows the chunk text (or a loading note).
 */
export function ChunkContextView({ ctx, fallbackText, compact }: ChunkContextViewProps) {
  const markRef = useRef<HTMLElement>(null);

  useEffect(() => {
    markRef.current?.scrollIntoView({ block: "center" });
  }, [ctx]);

  const className = `ctx${compact ? " ctx--compact" : ""}`;

  if (!ctx) {
    return (
      <div className={className}>
        <mark className="ctx__hl" ref={markRef}>
          {fallbackText || "Loading…"}
        </mark>
      </div>
    );
  }

  return (
    <div className={className}>
      {ctx.before_truncated && <span className="ctx__dots">…</span>}
      <span className="ctx__dim">{ctx.before}</span>
      <mark className="ctx__hl" ref={markRef}>
        {ctx.text}
      </mark>
      <span className="ctx__dim">{ctx.after}</span>
      {ctx.after_truncated && <span className="ctx__dots">…</span>}
    </div>
  );
}
