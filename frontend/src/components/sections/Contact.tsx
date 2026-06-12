import React, { useState } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle } from "lucide-react"

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({ name: "", email: "", subject: "", message: "" })
    }, 3500)
  }

  return (
    <section
      id="contact"
      data-section="contact"
      className="section-container reveal scroll-mt-20"
    >
      <span className="section-label">07 / CONTACT</span>
      <h2 className="section-title mb-10 select-none">Let's Connect</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_0.8fr] gap-8 items-stretch">
        
        {/* Column 1: Contact info */}
        <div className="glass-card flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h3 className="font-headings font-bold text-base text-[var(--text-primary)]">
              Direct Contact
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--accent-primary)] shrink-0" />
                <a
                  href="mailto:pavankumarkunukuntla@gmail.com"
                  className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors truncate"
                >
                  pavankumarkunukuntla@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--accent-primary)] shrink-0" />
                <a
                  href="tel:+919391118474"
                  className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  +91 9391118474
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[var(--accent-primary)] shrink-0" />
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  Basar, Telangana, India
                </span>
              </div>
            </div>

            {/* Availability Badge */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded font-mono text-[10px] font-bold select-none max-w-max"
              style={{
                background: "rgba(0,255,136,0.1)",
                color: "var(--accent-green)",
                border: "1px solid rgba(0,255,136,0.3)"
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span>Open to Opportunities</span>
            </div>
          </div>

          {/* Social Row */}
          <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
            <a
              href="https://linkedin.com/in/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all duration-300 transform hover:scale-[1.2]"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all duration-300 transform hover:scale-[1.2]"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Form */}
        <div className="glass-card flex flex-col justify-between">
          <h3 className="font-headings font-bold text-base text-[var(--text-primary)] mb-6">
            Message Console
          </h3>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <CheckCircle className="text-[var(--accent-green)] animate-bounce" size={40} />
              <h4 className="font-headings font-bold text-sm text-[var(--text-primary)]">
                Transmission Sent
              </h4>
              <p className="font-body text-xs text-[var(--text-secondary)]">
                Thank you. Pavan will review this shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  id="form-name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`form-input ${formState.name ? "has-value" : ""}`}
                  required
                />
                <label htmlFor="form-name" className="form-label">
                  Your Name
                </label>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="form-email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`form-input ${formState.email ? "has-value" : ""}`}
                  required
                />
                <label htmlFor="form-email" className="form-label">
                  Your Email
                </label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  id="form-subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className={`form-input ${formState.subject ? "has-value" : ""}`}
                  required
                />
                <label htmlFor="form-subject" className="form-label">
                  Subject
                </label>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  id="form-message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  className={`form-input resize-none py-4 ${
                    formState.message ? "has-value" : ""
                  }`}
                  required
                />
                <label htmlFor="form-message" className="form-label">
                  Your Message
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-black font-headings font-bold text-sm transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Send size={14} /> Send Message →
              </button>
            </form>
          )}
        </div>

        {/* Column 3: Quick Stats */}
        <div className="glass-card flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-headings font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider select-none mb-4 pb-2 border-b border-[var(--border)]">
              Available for
            </h3>
            
            <ul className="space-y-3.5 font-mono text-[11px] text-[var(--text-secondary)]">
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--accent-primary)] font-bold text-xs select-none">✓</span>
                <span>Internships</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--accent-primary)] font-bold text-xs select-none">✓</span>
                <span>Freelance Projects</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--accent-primary)] font-bold text-xs select-none">✓</span>
                <span>Full-time Roles (Post 2027)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--accent-primary)] font-bold text-xs select-none">✓</span>
                <span>Research Collaborations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--accent-primary)] font-bold text-xs select-none">✓</span>
                <span>Open Source Contributions</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}
export default Contact
