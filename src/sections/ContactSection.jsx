import { useState } from 'react'
import './ContactSection.css'

const CONTACT_EMAIL = 'oteroalan06@gmail.com'
const WHATSAPP_NUMBER = '5491137877374' // reemplazar con el número real (sin + ni espacios)

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const { name, email, service, message } = formData

    const subject = `New inquiry from ${name} — ${service || 'General'}`
    const body = `Name: ${name}\nEmail: ${email}\nService: ${service || '—'}\n\n${message}`

    // mailto
    const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const mailLink = document.createElement('a')
    mailLink.href = mailtoHref
    mailLink.click()

    // whatsapp
    const waText = `Hi Marea! I'm ${name} (${email}).\nService: ${service || '—'}\n\n${message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener')

    setSent(true)
    setFormData({ name: '', email: '', service: '', message: '' })
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">

        <div className="contact-header">
          <h2 className="contact-title">
            <span className="contact-title__white">LET'S</span>
            <span className="contact-title__orange">WORK</span>
          </h2>

          <p className="contact-subtitle">
            Got a project in mind? Tell us about it —<br />
            we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="contact-body">
          <div className="contact-info">
            <div className="contact-info__block">
              <span className="contact-info__label">Email</span>
              <a href="mailto:hello@somosmarea.com" className="contact-info__value">
                hello@somosmarea.com
              </a>
            </div>
            <div className="contact-info__block">
              <span className="contact-info__label">Based in</span>
              <span className="contact-info__value">Buenos Aires, Argentina</span>
            </div>
            <div className="contact-info__block">
              <span className="contact-info__label">Follow us</span>
              <div className="contact-socials">
                <a href="#" className="contact-socials__link">Instagram</a>
                <a href="#" className="contact-socials__link">Behance</a>
                <a href="#" className="contact-socials__link">LinkedIn</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  className="contact-form__input"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  className="contact-form__input"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="cf-service">Service</label>
              <select
                id="cf-service"
                className="contact-form__input contact-form__select"
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="" disabled>Select a service</option>
                <option value="branding">Branding</option>
                <option value="motion">Motion Graphics</option>
                <option value="creative-direction">Creative Direction</option>
                <option value="ia-video">AI Video Production</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                className="contact-form__input contact-form__textarea"
                name="message"
                placeholder="Tell us about your project..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={`contact-form__submit${sent ? ' is-sent' : ''}`}>
              {sent ? 'Message sent!' : 'Send Message'}
              <span className="contact-form__arrow" aria-hidden="true">{sent ? '✓' : '→'}</span>
            </button>
          </form>
        </div>
      </div>

      <footer className="contact-footer">
        <span className="contact-footer__copy">© 2025 Marea. All rights reserved.</span>
        <span className="contact-footer__tag">Branding · Motion · Creative Direction</span>
      </footer>
    </section>
  )
}
