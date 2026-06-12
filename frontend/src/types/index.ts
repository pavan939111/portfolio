export type SectionKey =
  | "intro" | "about" | "skills"
  | "projects" | "experience"
  | "education" | "achievements" | "contact"

export type SpeechState =
  | "idle" | "speaking" | "listening"

export type AvatarState =
  | "idle" | "speaking" | "listening" | "hover"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: string[]
  timestamp: Date
}
