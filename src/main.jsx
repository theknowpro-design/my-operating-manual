import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { applyThemeToDocument, THEME_STORAGE_KEY } from './styles/themes.js'

const stored = localStorage.getItem(THEME_STORAGE_KEY)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
applyThemeToDocument(stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
