/** Typed client for the FastAPI backend (runs locally on :8000 by default). */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Citation = {
  source?: string;
  page?: number;
  start?: number;
  end?: number;
  text?: string;
  score?: number;
  [key: string]: unknown;
};

export type ChunkMeta = {
  id: string;
  page: number | null;
  start: number;
  end: number;
  length: number;
  preview: string;
};

export type FileChunks = {
  source: string;
  chunk_count: number;
  chunks: ChunkMeta[];
};

export type ChunksResponse = {
  files: FileChunks[];
  total_files: number;
  total_chunks: number;
};

export type ChunkContext = {
  source: string;
  page: number | null;
  start: number;
  end: number;
  before: string;
  text: string;
  after: string;
  before_truncated: boolean;
  after_truncated: boolean;
};

export type Health = {
  status: string;
  configured: boolean;
  chunks: number | null;
};

export type ConfigState = {
  configured: boolean;
  model: string;
  reasoning: string;
  has_env_key: boolean;
};

export type ConfigUpdate = {
  openai_api_key?: string;
  model?: string;
  reasoning?: string;
};

export type ToolStep = {
  tool: string;
  args: Record<string, unknown>;
  count: number | null;
  ok: boolean;
};

export type GuardrailFlag = {
  type: string;
  flagged?: boolean;
  score?: number;
  similarity?: number;
  categories?: string[];
  error?: string;
};

export type Guardrail = {
  allowed: boolean;
  reason: string | null;
  flags: GuardrailFlag[];
};

export type ChatResponse = {
  conversation_id: string;
  answer: string;
  citations: Citation[];
  steps: ToolStep[];
  guardrail?: Guardrail;
};

export type IngestResponse = {
  ingested: Array<Record<string, unknown>>;
  total_chunks: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<Health>("/health"),

  getConfig: () => request<ConfigState>("/config"),

  setConfig: (update: ConfigUpdate) =>
    request<{ configured: boolean; model: string; reasoning: string }>("/config", {
      method: "POST",
      body: JSON.stringify(update),
    }),

  browse: (mode: "directory" | "file" = "directory") =>
    request<{ path: string }>(`/browse?mode=${mode}`),

  ingest: (path: string, recursive = true) =>
    request<IngestResponse>("/ingest", {
      method: "POST",
      body: JSON.stringify({ path, recursive }),
    }),

  deleteChunks: (source?: string) =>
    request<{ deleted?: number; cleared?: boolean }>(
      `/chunks${source ? `?source=${encodeURIComponent(source)}` : ""}`,
      { method: "DELETE" },
    ),

  chat: (message: string, conversation_id?: string | null) =>
    request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, conversation_id }),
    }),

  chunks: () => request<ChunksResponse>("/chunks"),

  chunkContext: (source: string, start: number, end: number, page?: number | null) => {
    const params = new URLSearchParams({ source, start: String(start), end: String(end) });
    if (page != null) params.set("page", String(page));
    return request<ChunkContext>(`/chunk_context?${params.toString()}`);
  },
};
