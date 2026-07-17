import type { KeyboardEvent } from "react";
import { Button } from "../design-system";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/** Message input. Enter sends; Shift+Enter inserts a newline. */
export function Composer({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
}: ComposerProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  }

  return (
    <div className="composer">
      <textarea
        className="composer__input"
        value={value}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={onSend} disabled={disabled || !value.trim()} arrow>
        Send
      </Button>
    </div>
  );
}
