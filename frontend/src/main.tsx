import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChatProvider } from "./context/ChatContext"
import { VoiceProvider } from "./context/VoiceContext"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VoiceProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </VoiceProvider>
  </StrictMode>,
)
