import { config } from '../config'

export async function getVisitorCount(): Promise<number> {
  try {
    const response = await fetch(config.visitorCounterApiUrl)
    if (!response.ok) throw new Error('Failed to fetch visitor count')
    const data = await response.json() as { count: number }
    return data.count
  } catch (error) {
    console.error('Visitor counter error:', error)
    return -1
  }
}
