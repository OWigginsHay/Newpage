import { useState } from "react";
import { Button, Input } from "../design-system";
import {
  MODELS,
  REASONING_LEVELS,
  supportsReasoning,
  type ReasoningLevel,
} from "../models";

interface SettingsDialogProps {
  open: boolean;
  initialModel: string;
  initialReasoning: string;
  hasEnvKey: boolean;
  onClose: () => void;
  onSave: (apiKey: string, model: string, reasoning: string) => void;
}

/**
 * Modal for the OpenAI API key, model choice and reasoning effort. The key goes
 * to the local backend (in memory) and is cached in this browser only.
 */
export function SettingsDialog({
  open,
  initialModel,
  initialReasoning,
  hasEnvKey,
  onClose,
  onSave,
}: SettingsDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(initialModel);
  const [reasoning, setReasoning] = useState<ReasoningLevel>(
    (initialReasoning as ReasoningLevel) || "none",
  );

  if (!open) return null;

  const frontier = MODELS.filter((m) => m.tier === "frontier");
  const others = MODELS.filter((m) => m.tier === "other");
  const canReason = supportsReasoning(model);

  function choose(id: string) {
    setModel(id);
    if (!supportsReasoning(id)) setReasoning("none");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal__title">Settings</h2>
        <p className="modal__note">
          Your key stays on your machine — saved to a gitignored <code>.env</code> on
          the local backend (so it survives restarts) and cached in this browser.
          Never committed or sent anywhere else.
        </p>

        <Input
          label="OpenAI API key"
          type="password"
          autoComplete="off"
          value={apiKey}
          placeholder={hasEnvKey ? "•••• (a .env key is already set)" : "sk-…"}
          onChange={(e) => setApiKey(e.target.value)}
        />

        <div className="field">
          <span className="field__label">Model</span>
          <div className="model-grid">
            {frontier.map((m) => (
              <button
                type="button"
                key={m.id}
                className={`model-card${model === m.id ? " is-selected" : ""}`}
                onClick={() => choose(m.id)}
              >
                <span className="model-card__name">{m.name}</span>
                <span className="model-card__tag">{m.tagline}</span>
                <span className="model-card__meta">
                  <code>{m.id}</code>
                  {m.inputPrice && (
                    <span className="model-card__price">
                      {m.inputPrice} in · {m.outputPrice} out / MTok
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="field field--row">
          <label className="field__inline">
            <span className="field__label">Reasoning</span>
            <select
              className="select"
              value={reasoning}
              disabled={!canReason}
              onChange={(e) => setReasoning(e.target.value as ReasoningLevel)}
            >
              {REASONING_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="field__inline">
            <span className="field__label">Other models</span>
            <select
              className="select"
              value={others.some((m) => m.id === model) ? model : ""}
              onChange={(e) => e.target.value && choose(e.target.value)}
            >
              <option value="">—</option>
              {others.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="modal__actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(apiKey, model, reasoning)}>Save</Button>
        </div>
      </div>
    </div>
  );
}
