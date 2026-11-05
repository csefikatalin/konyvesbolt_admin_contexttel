import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TablazatProvider } from './contexts/TablazatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TablazatProvider>
      <App />
    </TablazatProvider>
  </StrictMode>,
)
