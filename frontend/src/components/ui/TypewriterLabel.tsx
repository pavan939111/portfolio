import React, { useState, useEffect, useRef } from "react"

interface TypewriterLabelProps {
  text: string
  className?: string
}

export const TypewriterLabel: React.FC<TypewriterLabelProps> = ({ text, className = "" }) => {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`font-mono text-[10px] tracking-[4px] text-[var(--text-muted)] uppercase ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={inView ? "inline-block animate-fade-in" : "inline-block opacity-0"}
          style={{
            animation: inView ? `typeChar 0.08s forwards` : "none",
            animationDelay: inView ? `${index * 40}ms` : "none"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  )
}

export default TypewriterLabel
