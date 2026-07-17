import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Input, logoBlack } from "./design-system";
import {
  api,
  type ChunksResponse,
  type Citation,
  type ConfigState,
  type Health,
  type ToolStep,
} from "./api";
import { supportsReasoning } from "./models";
import { SettingsDialog } from "./components/SettingsDialog";
import { ModelSelect } from "./components/ModelSelect";
import { ChatMessage } from "./components/ChatMessage";
import { Composer } from "./components/Composer";
import { DocumentsDrawer } from "./components/DocumentsDrawer";
import "./App.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  steps?: ToolStep[];
};

const KEY_STORAGE = "newpage.openai_key";

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [offline, setOffline] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const [ingestPath, setIngestPath] = useState("");
  const [ingesting, setIngesting] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const [docsOpen, setDocsOpen] = useState(false);
  const [chunks, setChunks] = useState<ChunksResponse | null>(null);
  const [chunksLoading, setChunksLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const loadChunks = useCallback(async () => {
    setChunksLoading(true);
    try {
      setChunks(await api.chunks());
    } catch {
      /* backend offline — the drawer shows an empty state */
    } finally {
      setChunksLoading(false);
    }
  }, []);

  const refreshStatus = useCallback(async (): Promise<ConfigState | null> => {
    try {
      const [nextHealth, nextConfig] = await Promise.all([api.health(), api.getConfig()]);
      setHealth(nextHealth);
      setConfig(nextConfig);
      setOffline(false);
      return nextConfig;
    } catch {
      setOffline(true);
      return null;
    }
  }, []);

  // On load: fetch status, and re-apply a key cached in this browser.
  useEffect(() => {
    void (async () => {
      const current = await refreshStatus();
      const stored = localStorage.getItem(KEY_STORAGE);
      if (stored && current && !current.configured) {
        try {
          await api.setConfig({ openai_api_key: stored, model: current.model });
          await refreshStatus();
        } catch {
          /* ignore — user can re-enter in Settings */
        }
      }
    })();
  }, [refreshStatus]);

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const configured = Boolean(config?.configured);

  async function handleSaveSettings(apiKey: string, model: string, reasoning: string) {
    // Persist first, so a transient backend outage doesn't lose the key — it
    // will be re-applied automatically on the next load.
    if (apiKey) localStorage.setItem(KEY_STORAGE, apiKey);
    setSettingsOpen(false);
    try {
      await api.setConfig({ openai_api_key: apiKey || undefined, model, reasoning });
      setBanner(null);
      await refreshStatus();
    } catch (error) {
      setBanner(
        `Key saved locally, but the backend isn't reachable (${(error as Error).message}). ` +
          `It'll apply automatically once the backend is up.`,
      );
    }
  }

  async function handleModelChange(model: string) {
    // Header quick-switch. Reset reasoning to "none" for non-reasoning models
    // so we never send reasoning_effort to a model that rejects it.
    const reasoning = supportsReasoning(model) ? config?.reasoning : "none";
    try {
      await api.setConfig({ model, reasoning });
      await refreshStatus();
    } catch (error) {
      setBanner(`Couldn't switch model: ${(error as Error).message}`);
    }
  }

  async function handleBrowse() {
    try {
      const { path } = await api.browse("directory");
      if (path) setIngestPath(path);
    } catch (error) {
      setBanner(`Couldn't open the file browser: ${(error as Error).message}`);
    }
  }

  async function handleIngest() {
    const path = ingestPath.trim();
    if (!path) return;
    setIngesting(true);
    setBanner(null);
    try {
      const result = await api.ingest(path);
      setBanner(`Indexed ${result.total_chunks} chunks from ${result.ingested.length} file(s).`);
      await Promise.all([refreshStatus(), loadChunks()]);
    } catch (error) {
      setBanner(`Ingest failed: ${(error as Error).message}`);
    } finally {
      setIngesting(false);
    }
  }

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);
    try {
      const response = await api.chat(text, conversationId);
      setConversationId(response.conversation_id);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          citations: response.citations,
          steps: response.steps,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${(error as Error).message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-app">
      <header className="chat-header">
        <img src={logoBlack} alt="Newpage" className="chat-logo" />
        <div className="chat-header__status">
          {offline ? (
            <Badge tone="danger" dot>
              Backend offline
            </Badge>
          ) : (
            <Badge tone={configured ? "success" : "warning"} dot>
              {configured ? "Ready" : "No API key"}
            </Badge>
          )}
          {!offline && health && (
            <span className="chat-header__meta">{health.chunks ?? 0} chunks</span>
          )}
          {!offline && config && (
            <ModelSelect value={config.model} onChange={handleModelChange} />
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDocsOpen(true);
              void loadChunks();
            }}
          >
            Documents
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setSettingsOpen(true)}>
            API key
          </Button>
        </div>
      </header>

      <div className="ingest-bar">
        <Input
          containerStyle={{ flex: 1 }}
          value={ingestPath}
          placeholder="Pick a folder or file to index, or type a path…"
          onChange={(e) => setIngestPath(e.target.value)}
        />
        <Button variant="ghost" onClick={handleBrowse} disabled={offline}>
          Browse…
        </Button>
        <Button
          variant="secondary"
          onClick={handleIngest}
          disabled={offline || ingesting || !ingestPath.trim()}
        >
          {ingesting ? "Indexing…" : "Ingest"}
        </Button>
      </div>

      {banner && <div className="banner">{banner}</div>}

      <div className="chat-scroll" ref={scrollRef}>
        <div className="chat-thread">
          {messages.length === 0 && (
            <div className="empty">
              <span className="empty__eyebrow">
                <span className="empty__bar" /> Chat with your docs
              </span>
              <h1 className="empty__title">Ask questions across your documents.</h1>
              <p className="empty__lead">
                {offline
                  ? "Start the backend (uvicorn app.main:app) to begin."
                  : configured
                    ? "Index a file or folder above, then ask a question below."
                    : "Add your OpenAI API key to get started."}
              </p>
              {!configured && !offline && (
                <Button onClick={() => setSettingsOpen(true)} arrow>
                  Add API key
                </Button>
              )}
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              citations={message.citations}
              steps={message.steps}
            />
          ))}
          {sending && <ChatMessage role="assistant" content="" typing />}
        </div>
      </div>

      <div className="composer-wrap">
        <div className="chat-thread">
          <Composer
            value={draft}
            onChange={setDraft}
            onSend={handleSend}
            disabled={!configured || offline || sending}
            placeholder={
              configured ? "Ask about your documents…" : "Add an API key to start chatting"
            }
          />
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        initialModel={config?.model ?? "gpt-5.6-terra"}
        initialReasoning={config?.reasoning ?? "none"}
        hasEnvKey={Boolean(config?.has_env_key)}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      <DocumentsDrawer
        open={docsOpen}
        data={chunks}
        loading={chunksLoading}
        onClose={() => setDocsOpen(false)}
        onRefresh={loadChunks}
      />
    </div>
  );
}

export default App;
