import React, { useState, useEffect, useRef } from "react"
import type { ChatMessage as ChatMessageType } from "../../types"
import { Volume2 } from "lucide-react"

interface ChatMessageProps {
  message: ChatMessageType
  isLatest: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isAssistant = message.role === "assistant"
  
  // Typewriter effect state
  const [displayedContent, setDisplayedContent] = useState(
    isAssistant && isLatest ? "" : message.content
  )
  const [isTyping, setIsTyping] = useState(isAssistant && isLatest)
  const indexRef = useRef(0)
  const contentRef = useRef(message.content)

  // Keep contentRef updated
  useEffect(() => {
    contentRef.current = message.content
  }, [message.content])

  // Typewriter effect trigger
  useEffect(() => {
    if (!isAssistant || !isLatest) {
      setDisplayedContent(message.content)
      setIsTyping(false)
      return
    }

    // Reset index and clear content
    indexRef.current = 0
    setDisplayedContent("")
    setIsTyping(true)

    const timer = setInterval(() => {
      const fullText = contentRef.current
      const currentIndex = indexRef.current
      if (currentIndex < fullText.length) {
        const nextChar = fullText.charAt(currentIndex)
        setDisplayedContent(prev => prev + nextChar)
        indexRef.current += 1
        
        // Dispatch custom event to notify container to scroll down
        window.dispatchEvent(new CustomEvent("chatScroll"))
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 12) // fast typing speed for high-efficiency feel

    return () => clearInterval(timer)
  }, [message.content, isAssistant, isLatest])

  return (
    <div className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex flex-col gap-2 group ${
          isAssistant ? "max-w-[85%] items-start" : "max-w-[80%] items-end"
        }`}
      >
        {/* Bubble */}
        <div
          className="relative leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            lineHeight: isAssistant ? "1.6" : "normal",
            padding: isAssistant ? "12px 16px" : "10px 16px",
            backgroundColor: isAssistant ? "var(--bg-tertiary)" : "var(--accent-primary)",
            color: isAssistant ? "var(--text-primary)" : "black",
            border: isAssistant ? "1px solid var(--border)" : "none",
            borderRadius: isAssistant ? "4px 16px 16px 16px" : "16px 16px 4px 16px",
            fontWeight: isAssistant ? "normal" : "500"
          }}
        >
          <p className="whitespace-pre-wrap">
            {displayedContent}
            {isTyping && (
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[var(--accent-primary)] animate-pulse" />
            )}
          </p>
        </div>

        {/* Citations below assistant bubble */}
        {isAssistant && !isTyping && message.sources && message.sources.length > 0 && (
          <div className="flex flex-col gap-1 mt-1 pl-1">
            <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
              Sources:
            </span>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((src, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider"
                  style={{
                    background: "rgba(0, 243, 255, 0.08)",
                    border: "1px solid rgba(0, 243, 255, 0.2)",
                    color: "var(--accent-primary)"
                  }}
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ChatMessage
