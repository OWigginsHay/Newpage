import type { Guardrail } from "../api";

const ShieldIcon = () => (
  <svg className="tool-chip__icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M8 1.5l5 1.8v4.1c0 3.1-2.1 5.3-5 6.6-2.9-1.3-5-3.5-5-6.6V3.3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/** Shows the input-guardrail outcome for a turn (moderation + jailbreak + drift). */
export function GuardrailChip({ guardrail }: { guardrail: Guardrail }) {
  const drift = guardrail.flags.find((f) => f.type === "drift");
  const jb = guardrail.flags.find((f) => f.type === "jailbreak");

  let variant = "ok";
  let label = "Screened";
  if (!guardrail.allowed) {
    variant = "blocked";
    label = "Blocked";
  } else if (drift?.flagged) {
    variant = "warn";
    label = "Topic shift";
  }

  const title = guardrail.flags
    .map((f) => {
      if (f.type === "moderation")
        return `moderation: ${f.error ? "n/a" : f.flagged ? `flagged (${(f.categories ?? []).join(", ")})` : "clean"}`;
      if (f.type === "jailbreak") return `jailbreak similarity: ${f.score ?? "—"}`;
      if (f.type === "drift") return `topic similarity: ${f.similarity ?? "—"}`;
      return f.type;
    })
    .join(" · ");

  return (
    <span className={`tool-chip guardrail-chip guardrail-chip--${variant}`} title={title}>
      <ShieldIcon />
      <span className="tool-chip__label">{label}</span>
      {jb?.flagged && <span className="tool-chip__detail">jailbreak</span>}
    </span>
  );
}
