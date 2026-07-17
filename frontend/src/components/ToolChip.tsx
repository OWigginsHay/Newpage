import type { ToolStep } from "../api";

function baseName(path: string): string {
  return path.split(/[\\/]/).pop() || path;
}

const SparkleIcon = () => (
  <svg className="tool-chip__icon" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" fill="currentColor" />
  </svg>
);

const SearchIcon = () => (
  <svg className="tool-chip__icon" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="7" cy="7" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <line x1="10.4" y1="10.4" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const FileIcon = () => (
  <svg className="tool-chip__icon" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 1.6h5L13 5.6V14a.4.4 0 0 1-.4.4H4.4A.4.4 0 0 1 4 14z" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9 1.8V5.4h3.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

function describe(step: ToolStep): { icon: React.ReactNode; label: string; detail?: string } {
  const { tool, args, count } = step;
  switch (tool) {
    case "query_rag":
      return {
        icon: <SparkleIcon />,
        label: "Semantic search",
        detail: count != null ? `${count} passage${count === 1 ? "" : "s"}` : undefined,
      };
    case "search_keyword":
      return {
        icon: <SearchIcon />,
        label: `Keyword “${String(args.keyword ?? "")}”`,
        detail: count != null ? `${count} match${count === 1 ? "" : "es"}` : undefined,
      };
    case "read_file":
      return {
        icon: <FileIcon />,
        label: "Read file",
        detail: args.path ? baseName(String(args.path)) : undefined,
      };
    default:
      return { icon: <SparkleIcon />, label: tool, detail: count != null ? String(count) : undefined };
  }
}

/** A little chip showing one tool the agent ran (icon + what it did + result count). */
export function ToolChip({ step }: { step: ToolStep }) {
  const { icon, label, detail } = describe(step);
  return (
    <span className={`tool-chip${step.ok ? "" : " tool-chip--error"}`} title={JSON.stringify(step.args)}>
      {icon}
      <span className="tool-chip__label">{label}</span>
      {detail && <span className="tool-chip__detail">{detail}</span>}
    </span>
  );
}
