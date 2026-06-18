import React, { useState, useEffect, useRef } from "react"

interface CountUpProps {
  end: number
  suffix?: string
  decimals?: number
  duration?: number
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  suffix = "",
  decimals = 0,
  duration = 1.5
}) => {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      
      // easeOutQuad curve: progress * (2 - progress)
      const easeProgress = progress * (2 - progress)
      const value = easeProgress * end
      setCount(value)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, end, duration])

  return (
    <span ref={elementRef} className="font-headings font-extrabold select-none">
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export default CountUp
