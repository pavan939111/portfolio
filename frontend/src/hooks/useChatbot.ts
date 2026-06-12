import { useState, useCallback, useEffect } from "react"
import { sendChatMessage } from "../services/api"
import type { ChatMessage } from "../types"
import type { Message } from "../services/api"

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm Pavan's AI assistant. Ask me anything about his skills, projects, or experience! 👋",
        timestamp: new Date()
      }
    ])
  }, [])

  const sendMessage = useCallback(async (textToSubmit?: string) => {
    const query = (textToSubmit || inputValue).trim()
    if (!query) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      // Build history (max last 10, role/content only)
      const chatHistory: Message[] = messages
        .filter(m => m.id !== "welcome")
        .slice(-10)
        .map(m => ({
          role: m.role,
          content: m.content
        }))

      const response = await sendChatMessage(query, chatHistory)

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.response,
        sources: response.sources,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      setError(err.message || "Failed to submit query.")
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, messages])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm Pavan's AI assistant. Ask me anything about his skills, projects, or experience! 👋",
        timestamp: new Date()
      }
    ])
    setError(null)
    setInputValue("")
  }, [])

  const openChat = useCallback(() => setIsOpen(true), [])
  const closeChat = useCallback(() => setIsOpen(false), [])

  return {
    messages,
    isLoading,
    error,
    inputValue,
    setInputValue,
    isOpen,
    sendMessage,
    clearChat,
    openChat,
    closeChat
  }
}
export default useChatbot
