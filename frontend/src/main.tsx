import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './design-system/styles.css' // tokens + fonts (must load before app styles)
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
