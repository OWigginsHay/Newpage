import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Open links in a new tab; react-markdown passes an extra `node` prop we drop.
const components: Components = {
  a({ node: _node, ...rest }) {
    return <a {...rest} target="_blank" rel="noopener noreferrer" />;
  },
};

/**
 * Renders assistant messages as Markdown (GFM: tables, lists, code, etc.).
 * Raw HTML is not rendered, so document text surfaced by the model can't inject
 * markup — a deliberate safety choice.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
