import { MODELS } from "../models";

/** Compact model switcher for the header — a quick alternative to the Settings dialog. */
export function ModelSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (model: string) => void;
  disabled?: boolean;
}) {
  const frontier = MODELS.filter((m) => m.tier === "frontier");
  const others = MODELS.filter((m) => m.tier === "other");
  const known = MODELS.some((m) => m.id === value);

  return (
    <select
      className="select select--header"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Model"
    >
      {!known && <option value={value}>{value}</option>}
      <optgroup label="Frontier">
        {frontier.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Other">
        {others.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
