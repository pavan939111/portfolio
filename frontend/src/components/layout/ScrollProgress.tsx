import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = document.getElementById("progressBar")

    const onScroll = () => {
      const scrollY  = window.pageYOffset
      const winH     = window.innerHeight
      const docH     = document.documentElement.scrollHeight
      const pct      = (scrollY / (docH - winH)) * 100
      if (bar) bar.style.width = `${pct}%`
    }

    window.addEventListener("scroll", onScroll,
      { passive: true }
    )
    return () =>
      window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="scroll-progress-container">
      <div
        className="scroll-progress-bar"
        id="progressBar"
        ref={barRef}
      />
    </div>
  )
}
