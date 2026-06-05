import { useState, useEffect } from 'react'

interface TimerProps {
  checkInTimestamp: string
}

export function Timer({ checkInTimestamp }: TimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const checkIn = new Date(checkInTimestamp).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - checkIn) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [checkInTimestamp])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <span className="text-3xl font-mono font-bold tabular-nums" aria-label="Elapsed time">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}
