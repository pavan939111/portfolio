import React from "react"

interface SoundWaveProps {
  isActive: boolean
  isListening: boolean
}

export const SoundWave: React.FC<SoundWaveProps> = ({ isActive, isListening }) => {
  const delays = [0, 0.1, 0.2, 0.1, 0]

  return (
    <div className="flex items-center gap-1 h-5 select-none pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => {
        let barColor = "var(--border)"
        let barHeight = "4px"
        let isAnimating = false

        if (isActive) {
          barColor = "var(--accent-primary)"
          isAnimating = true
        } else if (isListening) {
          barColor = "#3B82F6"
          isAnimating = true
        }

        return (
          <div
            key={i}
            className="w-[3px] rounded-[2px] transition-all duration-300"
            style={{
              backgroundColor: barColor,
              height: isAnimating ? undefined : barHeight,
              animation: isAnimating
                ? `soundwave 0.6s ease-in-out infinite ${delays[i]}s`
                : "none",
              minHeight: isAnimating ? undefined : "4px"
            }}
          />
        )
      })}
    </div>
  )
}
export default SoundWave
