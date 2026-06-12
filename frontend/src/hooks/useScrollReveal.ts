import { useEffect } from "react"

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    const mutationObs = new MutationObserver(
      (mutations) => {
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              if (
                node.classList.contains("reveal") ||
                node.classList.contains("stagger-parent")
              ) {
                observer.observe(node)
              }
              node.querySelectorAll(
                ".reveal, .stagger-parent"
              ).forEach(el => observer.observe(el))
            }
          })
        })
      }
    )

    document.querySelectorAll(
      ".reveal, .stagger-parent"
    ).forEach(el => observer.observe(el))

    mutationObs.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
      mutationObs.disconnect()
    }
  }, [])
}
