import { useState } from "react";
import { Button } from "../design-system";
import { api, type ChunkContext, type ChunkMeta, type ChunksResponse } from "../api";
import { DocumentTree } from "./DocumentTree";
import { ChunkContextView } from "./ChunkContextView";

interface DocumentsDrawerProps {
  open: boolean;
  data: ChunksResponse | null;
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

function baseName(path: string): string {
  return path.split(/[\\/]/).pop() || path;
}

/** Slide-over showing the indexed corpus as a folder → file → chunk tree,
 *  with a live preview of the selected chunk in its document context. */
export function DocumentsDrawer({ open, data, loading, onClose, onRefresh }: DocumentsDrawerProps) {
  const [selected, setSelected] = useState<{ source: string; chunk: ChunkMeta } | null>(null);
  const [ctx, setCtx] = useState<ChunkContext | null>(null);
  const [ctxLoading, setCtxLoading] = useState(false);

  async function selectChunk(source: string, chunk: ChunkMeta) {
    setSelected({ source, chunk });
    setCtx(null);
    setCtxLoading(true);
    try {
      setCtx(await api.chunkContext(source, chunk.start, chunk.end, chunk.page));
    } catch {
      setCtx(null);
    } finally {
      setCtxLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Indexed documents">
        <header className="drawer__head">
          <div>
            <h2 className="drawer__title">Indexed documents</h2>
            <p className="drawer__sub">
              {data ? `${data.total_files} files · ${data.total_chunks} chunks` : "…"}
            </p>
          </div>
          <div className="drawer__head-actions">
            <Button size="sm" variant="ghost" onClick={onRefresh}>
              Refresh
            </Button>
            <button className="drawer__close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </header>

        <div className="drawer__body">
          <div className="drawer__tree">
            {loading ? (
              <p className="drawer__empty">Loading…</p>
            ) : !data || data.files.length === 0 ? (
              <p className="drawer__empty">Nothing indexed yet — use the ingest bar to add documents.</p>
            ) : (
              <DocumentTree
                files={data.files}
                onSelect={selectChunk}
                selectedId={selected?.chunk.id ?? null}
              />
            )}
          </div>

          <div className="drawer__preview">
            {selected ? (
              <>
                <div className="drawer__preview-head">
                  {baseName(selected.source)} · chars {selected.chunk.start}–{selected.chunk.end}
                </div>
                <ChunkContextView
                  ctx={ctxLoading ? null : ctx}
                  fallbackText={selected.chunk.preview}
                />
              </>
            ) : (
              <p className="drawer__empty">Select a chunk to preview it in context.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
