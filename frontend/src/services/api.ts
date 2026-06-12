const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ChatResponse {
  response: string
  sources: string[]
  chunks_used: number
  timestamp: string
}

export interface HealthResponse {
  status: string
  environment: string
  claude_model: string
  embedding_model: string
  embedding_dim: number
}

export async function sendChatMessage(
  message: string,
  history: Message[]
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history })
  })
  if (!res.ok) {
    throw new Error(
      `API error: ${res.status} ${res.statusText}`
    )
  }
  return res.json()
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/api/health`)
  if (!res.ok) throw new Error("Backend unreachable")
  return res.json()
}
