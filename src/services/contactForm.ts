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

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  const response = await fetch(config.contactApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result: ContactResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send message')
  }

  return result
}
