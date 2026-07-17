# Frontend — Chat With Your Docs

React + TypeScript + Vite app on the Newpage Design System. It talks to the
FastAPI backend (default `http://localhost:8000`) and lets you set the OpenAI API
key from the UI.

```bash
npm install      # download dependencies
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run lint     # oxlint
```

Configure the backend URL via `VITE_API_URL` (see `.env.example`). Full setup and
architecture are in the [root README](../README.md).

Key files: `src/api.ts` (backend client), `src/App.tsx` (chat app),
`src/components/` (SettingsDialog, ChatMessage, Composer), `src/design-system/`
(the Newpage Design System).
