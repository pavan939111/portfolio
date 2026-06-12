import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth <= 1024) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let frameId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${mouseX}px,${mouseY}px,0)
           translate(-50%,-50%)`
      }
    }

    const updateRing = () => {
      const LERP = 0.15
      ringX += (mouseX - ringX) * LERP
      ringY += (mouseY - ringY) * LERP
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringX}px,${ringY}px,0)
           translate(-50%,-50%)`
      }
      frameId = requestAnimationFrame(updateRing)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest(
        "a,button,[role=button],.interactive-node"
      )) {
        document.body.classList.add("cursor-hover")
      }
    }
    const onOut = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest(
        "a,button,[role=button],.interactive-node"
      )) {
        document.body.classList.remove("cursor-hover")
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", onOver)
    window.addEventListener("mouseout", onOut)
    frameId = requestAnimationFrame(updateRing)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", onOver)
      window.removeEventListener("mouseout", onOut)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
