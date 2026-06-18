import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isClicking, setIsClicking] = useState(false)
  const [isShrinking, setIsShrinking] = useState(false)

  useEffect(() => {
    // Custom cursor only active on desktop screens (screen width > 1024px)
    if (window.innerWidth <= 1024) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let frameId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        // Dot moves exactly with mouse
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }
    }

    const updateRing = () => {
      const LERP = 0.12
      ringX += (mouseX - ringX) * LERP
      ringY += (mouseY - ringY) * LERP
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      frameId = requestAnimationFrame(updateRing)
    }

    // Hover listeners
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target) return

      // Expand ring on interactive items
      if (target.closest("a, button, [role=button], .interactive, .interactive-node, select, input, textarea")) {
        document.body.classList.add("cursor-hover")
      }

      // Shrink dot on text hover zones
      if (target.closest("p, h1, h2, h3, h4, span, li, td, .text-hover-zone")) {
        setIsShrinking(true)
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target) return

      if (target.closest("a, button, [role=button], .interactive, .interactive-node, select, input, textarea")) {
        document.body.classList.remove("cursor-hover")
      }

      if (target.closest("p, h1, h2, h3, h4, span, li, td, .text-hover-zone")) {
        setIsShrinking(false)
      }
    }

    const onMouseDown = () => {
      setIsClicking(true)
    }

    const onMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", onMouseOver)
    window.addEventListener("mouseout", onMouseOut)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    frameId = requestAnimationFrame(updateRing)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", onMouseOver)
      window.removeEventListener("mouseout", onMouseOut)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      <div 
        className={`cursor-dot transition-transform duration-150 ease-out pointer-events-none ${
          isClicking ? "scale-[0.7]" : isShrinking ? "scale-[0.6]" : "scale-100"
        }`} 
        ref={dotRef}  
      />
      <div className="cursor-ring pointer-events-none flex items-center justify-center" ref={ringRef}>
        {/* Rotation wrapper for HUD crosshair ticks */}
        <div className="relative w-full h-full cursor-ring-inner">
          <div className="absolute w-[1px] h-[4px] bg-[var(--accent-primary)] top-[-6px] left-1/2 -translate-x-1/2" />
          <div className="absolute w-[1px] h-[4px] bg-[var(--accent-primary)] bottom-[-6px] left-1/2 -translate-x-1/2" />
          <div className="absolute w-[4px] h-[1px] bg-[var(--accent-primary)] left-[-6px] top-1/2 -translate-y-1/2" />
          <div className="absolute w-[4px] h-[1px] bg-[var(--accent-primary)] right-[-6px] top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </>
  )
}

export default CustomCursor
