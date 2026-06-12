import React, { useState } from "react"
import { useChat } from "../../context/ChatContext"
import { MessageSquare, X } from "lucide-react"

export function ChatButton() {
  const { isChatOpen, toggleChat } = useChat()
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: isChatOpen ? "calc(var(--chat-panel-width) + 16px)" : "28px",
        zIndex: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
        transition: "right 0.4s cubic-bezier(0.76, 0, 0.24, 1)"
      }}
    >
      {/* Tooltip — shows on hover when closed */}
      {showTooltip && !isChatOpen && (
        <div
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
          }}
        >
          Ask about Pavan
        </div>
      )}

      {/* Main button */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: isChatOpen ? "var(--bg-tertiary)" : "var(--accent-primary)",
          border: isChatOpen ? "1px solid var(--border)" : "none",
          color: isChatOpen ? "var(--text-muted)" : "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.76, 0, 0.24, 1)"
        }}
        className={isChatOpen ? "" : "animate-chat-pulse"}
      >
        <div
          style={{
            transition: "transform 0.3s var(--easing)",
            transform: isChatOpen ? "rotate(90deg)" : "rotate(0deg)"
          }}
        >
          {isChatOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </div>
      </button>
    </div>
  )
}
export default ChatButton
