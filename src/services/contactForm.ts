import { config } from '../config'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactResponse {
  success?: boolean
  message?: string
  error?: string
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

let scriptLoaded = false

export function loadRecaptchaScript(): void {
  if (scriptLoaded) return
  scriptLoaded = true
  const script = document.createElement('script')
  script.src = `https://www.google.com/recaptcha/api.js?render=${config.recaptchaSiteKey}`
  script.async = true
  document.head.appendChild(script)
}

async function getRecaptchaToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'))
      return
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(config.recaptchaSiteKey, { action: 'contact_submit' })
        .then(resolve)
        .catch(reject)
    })
  })
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  const recaptchaToken = await getRecaptchaToken()

  const response = await fetch(config.contactApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, recaptchaToken }),
  })

  const result: ContactResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send message')
  }

  return result
}
