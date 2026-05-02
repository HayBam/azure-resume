import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, Clock, Mail, User, MessageSquare, Type } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { submitContactForm } from '../services/contactForm'

type FormStatus = 'idle' | 'sending' | 'success' | 'error' | 'rate-limited'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const canSubmit = name.trim() && email.trim() && subject.trim() && message.trim() && status !== 'sending'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setStatus('sending')
    setErrorMessage('')

    try {
      await submitContactForm({ name, email, subject, message })
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg.includes('maximum number of messages')) {
        setStatus('rate-limited')
      } else {
        setStatus('error')
      }
      setErrorMessage(msg)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="animate-fade-in-up">
        <SectionHeading
          title="Contact Me"
          subtitle="Have a question or want to work together? Send me a message and I'll get back to you as soon as possible."
        />
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        {status === 'success' ? (
          <div className="animate-fade-in-up rounded-2xl border border-accent-500/30 bg-accent-500/5 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-accent-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-theme-primary mb-2">Message Sent!</h3>
            <p className="text-theme-secondary mb-6">
              Thank you for reaching out. I'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-6">
            {(status === 'error' || status === 'rate-limited') && (
              <div className={`flex items-start gap-3 rounded-xl border p-4 ${
                status === 'rate-limited'
                  ? 'border-yellow-500/30 bg-yellow-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}>
                {status === 'rate-limited' ? (
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                )}
                <p className={status === 'rate-limited' ? 'text-yellow-400' : 'text-red-400'}>
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-theme-secondary mb-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-theme bg-theme-surface text-theme-primary placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-theme-secondary mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-theme bg-theme-surface text-theme-primary placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-theme-secondary mb-2">
                <Type className="w-4 h-4" />
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                maxLength={200}
                required
                className="w-full px-4 py-3 rounded-xl border border-theme bg-theme-surface text-theme-primary placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-theme-secondary mb-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={5000}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-theme bg-theme-surface text-theme-primary placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors resize-y"
                placeholder="Your message..."
              />
              <p className="text-xs text-theme-faint mt-1.5 text-right">{message.length} / 5000</p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              {status === 'sending' ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
