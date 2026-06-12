import React, { useRef, useEffect } from "react"
import { useChat } from "../../context/ChatContext"
import { useChatbot } from "../../hooks/useChatbot"
import { ChatMessage } from "./ChatMessage"
import { useVoice } from "../../context/VoiceContext"
import { X, RefreshCw, Mic, Send } from "lucide-react"

export const ChatPanel: React.FC = () => {
  const { isChatOpen, closeChat } = useChat()
  const {
    messages,
    isLoading,
    error,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat
  } = useChatbot()
  
  const {
    startListening,
    stopListening,
    isListening,
    transcript
  } = useVoice()

  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages, isLoading])

  // Sync vocal transcript to the input box while listening
  useEffect(() => {
    if (isListening && transcript) {
      setInputValue(transcript)
    }
  }, [isListening, transcript, setInputValue])

  // Scroll to bottom dynamically during typewriter effect typing
  useEffect(() => {
    const handleScroll = () => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth"
      })
    }
    window.addEventListener("chatScroll", handleScroll)
    return () => window.removeEventListener("chatScroll", handleScroll)
  }, [])

  return (
    <>
      {/* ── DESKTOP & MOBILE FIXED PANEL ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "420px",
          height: "100vh",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border)",
          transform: isChatOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s var(--easing)"
        }}
        className="chat-panel"
      >
        {/* ━━ PANEL HEADER ━━ */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0
          }}
        >
          {/* Close button — X on left */}
          <button
            onClick={closeChat}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s ease"
            }}
            className="hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]"
          >
            <X size={16} />
          </button>

          {/* Title */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--accent-primary)",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "2px"
              }}
            >
              AI ASSISTANT
            </p>
            <p
              style={{
                fontFamily: "var(--font-headings)",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text-primary)"
              }}
            >
              Ask About Pavan
            </p>
          </div>

          {/* Online dot + clear button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            {/* Online indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#00ff88",
                  boxShadow: "0 0 8px rgba(0,255,136,0.4)"
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "#00ff88"
                }}
              >
                online
              </span>
            </div>

            {/* Clear chat */}
            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-[var(--accent-primary)] transition-colors"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* ━━ MESSAGES AREA ━━ */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            background: "var(--bg-primary)"
          }}
          className="scrollbar-thin"
        >
          {/* Welcome + suggestions */}
          {messages.length === 1 && (
            <div>
              {/* Welcome bubble */}
              <div
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "14px 16px",
                  maxWidth: "95%",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  marginBottom: "16px"
                }}
              >
                Hi! I'm Pavan's AI assistant powered by Claude. Ask me anything about his skills, projects, or experience! 👋
              </div>

              {/* Suggested questions */}
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--text-muted)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "10px"
                }}
              >
                QUICK QUESTIONS
              </p>

              {[
                "What are Pavan's main skills?",
                "Tell me about FailureRAG",
                "Where did Pavan intern?",
                "Is he available for hire?",
                "What is the Nina SDK?"
              ].map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    marginBottom: "7px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  className="hover:bg-[rgba(255,122,0,0.08)] hover:border-[rgba(255,122,0,0.3)] hover:text-[var(--text-primary)] hover:pl-[18px]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* All chat messages */}
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isLatest={index === messages.length - 1}
            />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "12px 16px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                borderRadius: "4px 16px 16px 16px",
                width: "fit-content"
              }}
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "var(--accent-primary)",
                    opacity: 0.7,
                    animation: "bounce 1.2s ease infinite",
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "10px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#EF4444"
              }}
            >
              {error}
            </div>
          )}

          {/* Auto scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* ━━ INPUT AREA ━━ */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexShrink: 0
          }}
        >
          {/* Text input */}
          <input
            type="text"
            placeholder="Ask anything about Pavan..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault()
                const val = inputValue.trim()
                if (val) sendMessage(val)
              }
            }}
            disabled={isLoading}
            style={{
              flex: 1,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "11px 16px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              outline: "none",
              transition: "all 0.2s ease"
            }}
            className="focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_3px_rgba(255,122,0,0.08)]"
          />

          {/* Mic button */}
          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            title="Hold to speak"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              flexShrink: 0,
              background: isListening ? "rgba(59,130,246,0.15)" : "var(--bg-tertiary)",
              border: `1px solid ${isListening ? "#3B82F6" : "var(--border)"}`,
              color: isListening ? "#3B82F6" : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <Mic size={16} />
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              flexShrink: 0,
              background: isLoading || !inputValue.trim() ? "rgba(255,122,0,0.3)" : "var(--accent-primary)",
              border: "none",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isLoading || !inputValue.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s ease"
            }}
            className="enabled:hover:scale-[1.05] enabled:hover:shadow-[0_4px_12px_rgba(255,122,0,0.4)]"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* ── MOBILE OVERLAY BACKDROP ── */}
      {isChatOpen && (
        <div
          onClick={closeChat}
          style={{
            display: "none"
          }}
          className="chat-mobile-backdrop"
        />
      )}
    </>
  )
}
export default ChatPanel
