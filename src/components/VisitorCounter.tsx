import { useEffect, useRef, useState } from 'react'
import { Eye } from 'lucide-react'
import { getVisitorCount } from '../services/visitorCounter'

function useCountUp(target: number | null, duration = 1500) {
  const [display, setDisplay] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (target === null || hasAnimated.current) return
    hasAnimated.current = true

    const end = target
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(end * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return display
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const hasFetched = useRef(false)
  const displayCount = useCountUp(count)

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
    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-theme-surface-solid border border-theme text-base transition-colors duration-300">
      <Eye className="w-5 h-5 text-primary-400" />
      <span className="text-theme-secondary">
        {error ? (
          'Visitor counter unavailable'
        ) : count === null ? (
          <span className="inline-block w-8 h-4 bg-theme-badge rounded animate-pulse" />
        ) : (
          <>
            This site has been visited{' '}
            <span className="font-mono font-semibold text-theme-primary">{displayCount.toLocaleString()}</span>
            {' '}times
          </>
        )}
      </span>
    </div>
  )
}
