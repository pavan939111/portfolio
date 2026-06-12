import React, { useState, useEffect } from "react"

const TEST_TEXT = `Hi! Welcome to my portfolio.
  I am Pavan Kumar, an Agentic AI Engineer.
  I build autonomous AI systems and intelligent
  applications. This is how I sound on your device.`

export const VoiceTester: React.FC = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [rate, setRate] = useState(0.88)
  const [pitch, setPitch] = useState(0.95)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      const english = v.filter(v => v.lang.startsWith("en"))
      setVoices(english)
      if (english.length > 0) {
        setSelectedVoice(english[0].name)
      }
    }
    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
  }, [])

  const testVoice = () => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(TEST_TEXT)
    u.rate  = rate
    u.pitch = pitch

    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) u.voice = voice

    u.onstart = () => setIsSpeaking(true)
    u.onend   = () => setIsSpeaking(false)

    window.speechSynthesis.speak(u)
  }

  const stopVoice = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      background: "#0D1425",
      border: "1px solid #00F5FF",
      borderRadius: 12,
      padding: 20,
      width: 320,
      zIndex: 9999,
      color: "white"
    }}>
      <h3 style={{ color: "#00F5FF", margin: "0 0 12px", fontSize: 16 }}>
        🎙️ Voice Tester
      </h3>

      {/* Voice selector */}
      <label style={{ fontSize: 12, color: "#94A3B8" }}>
        Voice
      </label>
      <select
        value={selectedVoice}
        onChange={e => setSelectedVoice(e.target.value)}
        style={{
          width: "100%",
          background: "#1E293B",
          color: "white",
          border: "1px solid #334155",
          borderRadius: 6,
          padding: "4px 8px",
          marginBottom: 12,
          fontSize: 12
        }}
      >
        {voices.map(v => (
          <option key={v.name} value={v.name}>
            {v.name}
            {!v.localService ? " ⭐" : ""}
          </option>
        ))}
      </select>

      {/* Rate slider */}
      <label style={{ fontSize: 12, color: "#94A3B8" }}>
        Speed: {rate}
      </label>
      <input
        type="range"
        min={0.5} max={1.5} step={0.05}
        value={rate}
        onChange={e => setRate(Number(e.target.value))}
        style={{ width: "100%", marginBottom: 12 }}
      />

      {/* Pitch slider */}
      <label style={{ fontSize: 12, color: "#94A3B8" }}>
        Pitch: {pitch}
      </label>
      <input
        type="range"
        min={0.5} max={1.5} step={0.05}
        value={pitch}
        onChange={e => setPitch(Number(e.target.value))}
        style={{ width: "100%", marginBottom: 12 }}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={testVoice}
          disabled={isSpeaking}
          style={{
            flex: 1,
            background: isSpeaking ? "#334155" : "#00F5FF",
            color: isSpeaking ? "white" : "black",
            border: "none",
            borderRadius: 6,
            padding: "8px 0",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {isSpeaking ? "Speaking..." : "▶ Test"}
        </button>
        <button
          onClick={stopVoice}
          style={{
            flex: 1,
            background: "#EF4444",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 0",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          ■ Stop
        </button>
      </div>

      {/* Selected voice name */}
      <p style={{
        fontSize: 10,
        color: "#64748B",
        marginTop: 8,
        marginBottom: 0
      }}>
        ⭐ = cloud neural voice (best quality)
        <br />
        Copy best settings to VOICE_CONFIG
      </p>
    </div>
  )
}
