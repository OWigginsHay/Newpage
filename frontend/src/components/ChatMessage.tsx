import type { Citation, Guardrail, ToolStep } from "../api";
import { CitationChip } from "./CitationChip";
import { Markdown } from "./Markdown";
import { ToolChip } from "./ToolChip";
import { GuardrailChip } from "./GuardrailChip";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  steps?: ToolStep[];
  guardrail?: Guardrail;
  typing?: boolean;
}

/** One chat turn. Assistant turns show the tools the agent ran, then the answer
 *  and its citations. */
export function ChatMessage({ role, content, citations, steps, guardrail, typing }: ChatMessageProps) {
  const isUser = role === "user";
  const hasTools = Boolean((steps && steps.length > 0) || guardrail);
  return (
    <div className={`msg ${isUser ? "msg--user" : "msg--assistant"}`}>
      {hasTools && (
        <div className="msg__tools">
          {guardrail && <GuardrailChip guardrail={guardrail} />}
          {steps?.map((step, index) => (
            <ToolChip step={step} key={index} />
          ))}
        </div>
      )}

      <div className="msg__bubble">
        {typing ? (
          <span className="msg__typing" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </span>
        ) : isUser ? (
          content
        ) : (
          <Markdown>{content}</Markdown>
        )}
      </div>

      {citations && citations.length > 0 && (
        <div className="msg__citations">
          {citations.map((citation, index) => (
            <CitationChip citation={citation} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
