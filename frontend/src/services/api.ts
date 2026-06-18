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

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactApiResponse {
  success: boolean
  message: string
  timestamp: string
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactApiResponse> {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      let errMsg = "";
      try {
        const errJson = await res.json()
        if (errJson && errJson.detail) {
          if (typeof errJson.detail === "string") {
            errMsg = errJson.detail
          } else if (Array.isArray(errJson.detail)) {
            errMsg = errJson.detail.map((e: any) => e.msg || e.message).join(", ")
          }
        } else if (errJson && errJson.message) {
          errMsg = errJson.message
        }
      } catch (e) {}
      throw new Error(errMsg || `API error: ${res.status} ${res.statusText}`)
    }

    return await res.json()
  } catch (err: any) {
    if (err.message) {
      throw err
    }
    throw new Error("Connection failed. Please check your network connection or try again later.")
  }
}


export async function transcribeAudio(
  audioBlob: Blob
): Promise<string> {
  const formData = new FormData()
  formData.append("file", audioBlob, "recording.wav")

  const res = await fetch(`${API_URL}/api/stt`, {
    method: "POST",
    body: formData
  })
  if (!res.ok) {
    throw new Error(
      `API error: ${res.status} ${res.statusText}`
    )
  }
  const data = await res.json()
  return data.transcript
}

export interface TelemetrySummary {
  totalQueries: number
  totalTokens: number
  totalCostUsd: number
  avgLatencyMs: number
  isMock: boolean
}

export interface TelemetryWeekly {
  day: string
  queries: number
  avgLatency: number
  tokens: number
  cost: number
}

export interface TelemetryLog {
  id: string
  user_query: string
  final_response: string
  latency_ms: number
  tokens_used: number
  cost_usd: number
  tools_called: string[]
  created_at: string
}

export interface ToolUsage {
  name: string
  value: number
}

export interface TelemetryResponse {
  summary: TelemetrySummary
  weeklyAnalytics: TelemetryWeekly[]
  recentLogs: TelemetryLog[]
  toolUsage: ToolUsage[]
}

export async function fetchTelemetry(): Promise<TelemetryResponse> {
  const res = await fetch(`${API_URL}/api/telemetry`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function getSttToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/stt/token`)
  if (!res.ok) {
    throw new Error(`Failed to get STT token: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  return data.token
}




