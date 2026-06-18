import React, { useState, useEffect, useRef } from "react"
import { ArrowUpRight, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react"
import { submitContactForm } from "../../services/api"
import type { ContactFormData } from "../../services/api"
import { TypewriterLabel } from "../ui/TypewriterLabel"

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

interface NotificationState {
  show: boolean
  type: "success" | "error"
  message: string
}

export const Contact: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formState, setFormState] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: ""
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const triggerNotification = (type: "success" | "error", message: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setNotification({
      show: true,
      type,
      message
    })

    const duration = type === "success" ? 5000 : 6000
    timeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, duration)
  }

  const dismissNotification = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setNotification((prev) => ({ ...prev, show: false }))
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        if (value.length > 100) return "Name cannot exceed 100 characters"
        return ""
      case "email": {
        if (!value.trim()) return "Email is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address"
        return ""
      }
      case "subject":
        if (!value.trim()) return "Subject is required"
        if (value.trim().length < 2) return "Subject must be at least 2 characters"
        if (value.length > 200) return "Subject cannot exceed 200 characters"
        return ""
      case "message":
        if (!value.trim()) return "Message is required"
        if (value.trim().length < 10) return "Message must be at least 10 characters"
        if (value.length > 2000) return "Message cannot exceed 2000 characters"
        return ""
      default:
        return ""
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name as keyof FormErrors]) {
      const fieldError = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || undefined
      }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const fieldError = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError || undefined
    }))
  }

  const validateAll = (): boolean => {
    const nameError = validateField("name", formState.name)
    const emailError = validateField("email", formState.email)
    const subjectError = validateField("subject", formState.subject)
    const messageError = validateField("message", formState.message)

    const newErrors: FormErrors = {}
    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (subjectError) newErrors.subject = subjectError
    if (messageError) newErrors.message = messageError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAll()) {
      triggerNotification("error", "Please correct the errors in the form before submitting.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitContactForm(formState)
      if (result.success) {
        triggerNotification("success", "Your message was transmitted successfully! A confirmation receipt has been sent to your email.")
        setFormState({ name: "", email: "", subject: "", message: "" })
        setErrors({})
        setIsFormVisible(false) // Collapse form on success
      } else {
        triggerNotification("error", result.message || "Failed to transmit message. Please try again.")
      }
    } catch (err: any) {
      console.error("Transmission failed:", err)
      triggerNotification("error", err.message || "Transmission failed. Please connect directly via email.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const directLinks = [
    { label: "Email", value: "pavankumarkunukuntla@gmail.com", href: "mailto:pavankumarkunukuntla@gmail.com" },
    { label: "GitHub", value: "github.com/pavankumarkunukuntla", href: "https://github.com/pavankumarkunukuntla", external: true },
    { label: "LinkedIn", value: "linkedin.com/in/pavankumarkunukuntla", href: "https://linkedin.com/in/pavankumarkunukuntla", external: true },
    { label: "Location", value: "Basar, India", href: null }
  ]

  return (
    <section
      id="contact"
      data-section="contact"
      className="section-container reveal scroll-mt-20 relative text-[var(--text-primary)]"
    >
      {/* Slide-down Notification Alert Box */}
      {notification.show && (
        <div 
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1100] w-[90%] max-w-[500px] rounded-xl border p-4 backdrop-blur-md flex items-start gap-3.5 shadow-2xl transition-all duration-300 notification-slide-down ${
            notification.type === "success" 
              ? "bg-black/90 border-[var(--accent-green)]/40 text-[var(--text-primary)] glow-green" 
              : "bg-black/90 border-red-500/40 text-[var(--text-primary)] glow-red"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {notification.type === "success" ? (
              <CheckCircle className="text-[var(--accent-green)]" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-headings font-bold text-xs uppercase tracking-wider">
              {notification.type === "success" ? "Transmission Verified" : "Transmission Warning"}
            </h4>
            <p className="font-mono text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {notification.message}
            </p>
          </div>
          <button 
            onClick={dismissNotification}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            aria-label="Dismiss Notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Redesigned Section Header Template */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="07 / CONTACT" />
        <h2 className="font-headings font-extrabold text-[40px] text-[var(--text-primary)] leading-[1.1]">
          Hard problems welcome.
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      <div className="max-w-[760px] space-y-10">
        {/* Pitch paragraph */}
        <p className="font-body text-base text-[var(--text-secondary)] leading-relaxed">
          I am open to AI engineering internships, freelance projects, research collaborations, and technical conversations about agentic AI and autonomous multi-agent systems.
        </p>

        {/* Direct Clickable Contact Rows */}
        <div className="border-t border-[var(--border)] select-none">
          {directLinks.map((link, idx) => {
            const hasLink = link.href !== null
            const Content = (
              <>
                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                  {link.label}
                </span>
                <div className="flex items-center gap-2 font-mono text-[13px] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150">
                  <span className="break-all">{link.value}</span>
                  {hasLink && <ArrowUpRight size={14} className="text-[var(--text-muted)] shrink-0" />}
                </div>
              </>
            )

            return hasLink ? (
              <a
                key={idx}
                href={link.href!}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center py-5 gap-2 border-b border-[var(--border)] hover:border-[var(--text-muted)] transition-colors duration-150"
              >
                {Content}
              </a>
            ) : (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center py-5 gap-2 border-b border-[var(--border)]"
              >
                {Content}
              </div>
            )
          })}
        </div>

        {/* Toggle Form Button */}
        <div className="pt-4 select-none">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="border border-[var(--border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-transparent text-xs font-mono tracking-widest uppercase p-[14px_28px] rounded-lg cursor-pointer transition-colors duration-200"
          >
            {isFormVisible ? "CLOSE MESSAGE CONSOLE" : "SEND A MESSAGE"}
          </button>
        </div>

        {/* Collapsible Contact Form */}
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isFormVisible ? "950px" : "0px",
            opacity: isFormVisible ? 1 : 0
          }}
        >
          <div className="mt-6 p-8 bg-[rgba(8,8,12,0.85)] backdrop-blur-md border border-white/[0.06] rounded-xl relative shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            {/* Tech Corner Brackets */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/10" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/10" />

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Name input */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="YOUR NAME"
                  className="w-full bg-black/40 border-b border-white/10 focus:border-[var(--accent-primary)] px-4 py-3.5 outline-none font-mono text-xs text-[var(--text-primary)] rounded-md transition-all duration-200 focus:shadow-[0_0_15px_rgba(0,212,255,0.04)] placeholder-white/30"
                  required
                />
                {errors.name && (
                  <span className="text-red-500 font-mono text-[10px] block pt-1 select-none">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email input */}
              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="YOUR EMAIL"
                  className="w-full bg-black/40 border-b border-white/10 focus:border-[var(--accent-primary)] px-4 py-3.5 outline-none font-mono text-xs text-[var(--text-primary)] rounded-md transition-all duration-200 focus:shadow-[0_0_15px_rgba(0,212,255,0.04)] placeholder-white/30"
                  required
                />
                {errors.email && (
                  <span className="text-red-500 font-mono text-[10px] block pt-1 select-none">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Subject input */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="SUBJECT"
                  className="w-full bg-black/40 border-b border-white/10 focus:border-[var(--accent-primary)] px-4 py-3.5 outline-none font-mono text-xs text-[var(--text-primary)] rounded-md transition-all duration-200 focus:shadow-[0_0_15px_rgba(0,212,255,0.04)] placeholder-white/30"
                  required
                />
                {errors.subject && (
                  <span className="text-red-500 font-mono text-[10px] block pt-1 select-none">
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Message textarea */}
              <div className="space-y-1">
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="YOUR MESSAGE"
                  className="w-full bg-black/40 border-b border-white/10 focus:border-[var(--accent-primary)] px-4 py-3.5 outline-none resize-none font-mono text-xs text-[var(--text-primary)] rounded-md transition-all duration-200 focus:shadow-[0_0_15px_rgba(0,212,255,0.04)] placeholder-white/30"
                  required
                />
                <div className="flex justify-between items-center pt-1.5 select-none">
                  <div>
                    {errors.message && (
                      <span className="text-red-500 font-mono text-[10px] block leading-none">
                        {errors.message}
                      </span>
                    )}
                  </div>
                  <span 
                    className={`font-mono text-[10px] ${
                      formState.message.length > 1800 
                        ? "text-[var(--accent-primary)] font-bold animate-pulse" 
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {formState.message.length} / 2000
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] disabled:opacity-50 text-black font-headings font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>TRANSMITTING payload...</span>
                  </>
                ) : (
                  <span>SEND MESSAGE</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
