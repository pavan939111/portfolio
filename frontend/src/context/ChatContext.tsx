import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from "react"

interface ChatContextType {
  isChatOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = useCallback(() => setIsChatOpen(true), [])
  const closeChat = useCallback(() => setIsChatOpen(false), [])
  const toggleChat = useCallback(() => setIsChatOpen(prev => !prev), [])

  // Listen for openChat custom event
  // (voice command "open chat" triggers this)
  useEffect(() => {
    const handler = () => openChat()
    window.addEventListener("openChat", handler)
    return () => window.removeEventListener("openChat", handler)
  }, [openChat])

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        openChat,
        closeChat,
        toggleChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error("useChat must be inside ChatProvider")
  }
  return ctx
}
