import { useEffect, useState } from 'react'
import { formatTimestamp } from '../../utils/formatTimestamp.js'
import './LongFormClock.css'

export function LongFormClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time className="long-form-clock" dateTime={now.toISOString()} aria-live="off">
      {formatTimestamp(now)}
    </time>
  )
}

export default LongFormClock
