import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './ContactSection.css'

const WHATSAPP_NUMBER = '5491137877374'

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    const { name, email, service, message } = formData

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name, from_email: email, service: service || '—', message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setStatus('sent')
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      return
    }

    // whatsapp
    const waText = `Hi Marea! I'm ${name} (${email}).\nService: ${service || '—'}\n\n${message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener')

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
              <span className="contact-info__value">Barrios Unidos, Capital District</span>
            </div>
            <div className="contact-info__block">
              <span className="contact-info__label">Follow us</span>
              <div className="contact-socials">
                <a href="#" className="contact-socials__link">Instagram</a>
                <a href="#" className="contact-socials__link">Behance</a>
                <a href="https://www.linkedin.com/company/marea-lab/" className="contact-socials__link">LinkedIn</a>
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

            <button
              type="submit"
              className={`contact-form__submit${status === 'sent' ? ' is-sent' : ''}${status === 'error' ? ' is-error' : ''}`}
              disabled={status === 'sending'}
            >
              {status === 'sending' && 'Sending…'}
              {status === 'sent' && 'Message sent!'}
              {status === 'error' && 'Error, try again'}
              {status === 'idle' && 'Send Message'}
              <span className="contact-form__arrow" aria-hidden="true">
                {status === 'sent' ? '✓' : status === 'error' ? '✕' : '→'}
              </span>
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
