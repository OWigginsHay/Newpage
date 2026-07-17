import { useState } from "react";
import type { ChunkMeta, FileChunks } from "../api";

interface FolderNode {
  name: string;
  folders: Map<string, FolderNode>;
  files: FileChunks[];
}

function buildTree(files: FileChunks[]): FolderNode {
  const root: FolderNode = { name: "", folders: new Map(), files: [] };
  for (const file of files) {
    const parts = file.source.split(/[\\/]/).filter(Boolean);
    parts.pop(); // drop the filename; it's rendered from file.source
    let node = root;
    for (const part of parts) {
      let child = node.folders.get(part);
      if (!child) {
        child = { name: part, folders: new Map(), files: [] };
        node.folders.set(part, child);
      }
      node = child;
    }
    node.files.push(file);
  }
  return root;
}

function baseName(path: string): string {
  return path.split(/[\\/]/).pop() || path;
}

const FolderIcon = () => (
  <svg className="tree-icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M1.5 3.5A1.5 1.5 0 0 1 3 2h3l1.5 1.5H13A1.5 1.5 0 0 1 14.5 5v6A1.5 1.5 0 0 1 13 12.5H3A1.5 1.5 0 0 1 1.5 11z"
      fill="currentColor"
      opacity="0.85"
    />
  </svg>
);

const FileIcon = () => (
  <svg className="tree-icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M4 1.5h5L13 5.5V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path d="M9 1.7V5.3h3.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

interface RowsProps {
  onSelect: (source: string, chunk: ChunkMeta) => void;
  selectedId: string | null;
}

function FileRow({ file, depth, onSelect, selectedId }: RowsProps & { file: FileChunks; depth: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="tree-row tree-row--file"
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="tree-caret">{open ? "▾" : "▸"}</span>
        <FileIcon />
        <span className="tree-name">{baseName(file.source)}</span>
        <span className="tree-badge">{file.chunk_count}</span>
      </button>
      {open &&
        file.chunks.map((chunk, index) => (
          <button
            type="button"
            key={chunk.id}
            className={`tree-row tree-row--chunk${selectedId === chunk.id ? " is-selected" : ""}`}
            style={{ paddingLeft: (depth + 1) * 14 + 22 }}
            onClick={() => onSelect(file.source, chunk)}
          >
            <span className="tree-chunk-num">Chunk {String(index + 1).padStart(2, "0")}</span>
            <span className="tree-chunk-meta">
              {chunk.length} chars
              {typeof chunk.page === "number" && chunk.page > 0 ? ` · p${chunk.page}` : ""}
            </span>
          </button>
        ))}
    </div>
  );
}

function FolderRow({ node, depth, onSelect, selectedId }: RowsProps & { node: FolderNode; depth: number }) {
  const [open, setOpen] = useState(depth < 3);
  return (
    <div>
      <button
        type="button"
        className="tree-row tree-row--folder"
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="tree-caret">{open ? "▾" : "▸"}</span>
        <FolderIcon />
        <span className="tree-name">{node.name}</span>
      </button>
      {open && <TreeLevel node={node} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />}
    </div>
  );
}

function TreeLevel({ node, depth, onSelect, selectedId }: RowsProps & { node: FolderNode; depth: number }) {
  const folders = [...node.folders.values()].sort((a, b) => a.name.localeCompare(b.name));
  const files = [...node.files].sort((a, b) => baseName(a.source).localeCompare(baseName(b.source)));
  return (
    <>
      {folders.map((child) => (
        <FolderRow key={child.name} node={child} depth={depth} onSelect={onSelect} selectedId={selectedId} />
      ))}
      {files.map((file) => (
        <FileRow key={file.source} file={file} depth={depth} onSelect={onSelect} selectedId={selectedId} />
      ))}
    </>
  );
}

export function DocumentTree({
  files,
  onSelect,
  selectedId,
}: {
  files: FileChunks[];
  onSelect: (source: string, chunk: ChunkMeta) => void;
  selectedId: string | null;
}) {
  const root = buildTree(files);
  return (
    <div className="tree">
      <TreeLevel node={root} depth={0} onSelect={onSelect} selectedId={selectedId} />
    </div>
  );
}
