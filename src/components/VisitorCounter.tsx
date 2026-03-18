import { useEffect, useRef, useState } from 'react'
import { Eye } from 'lucide-react'
import { getVisitorCount } from '../services/visitorCounter'

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    getVisitorCount().then((result) => {
      if (result === -1) {
        setError(true)
      } else {
        setCount(result)
      }
    })
  }, [])

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700/50 text-sm">
      <Eye className="w-4 h-4 text-primary-400" />
      <span className="text-gray-400">
        {error ? (
          'Visitor counter unavailable'
        ) : count === null ? (
          <span className="inline-block w-8 h-4 bg-gray-700 rounded animate-pulse" />
        ) : (
          <>
            <span className="font-mono font-semibold text-white">{count.toLocaleString()}</span>
            {' '}visits
          </>
        )}
      </span>
    </div>
  )
}
