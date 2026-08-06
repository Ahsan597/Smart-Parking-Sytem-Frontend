import { useEffect, useState } from 'react'

function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const msLeft = new Date(expiresAt).getTime() - now

  if (msLeft <= 0) {
    return <span className="text-xs font-medium text-rose-400">Expiring...</span>
  }

  const minutes = Math.floor(msLeft / 60000)
  const seconds = Math.floor((msLeft % 60000) / 1000)
  const urgent = msLeft < 5 * 60000

  return (
    <span className={`text-xs font-medium ${urgent ? 'text-amber-400' : 'text-slate-400'}`}>
      Expires in {minutes}m {seconds.toString().padStart(2, '0')}s
    </span>
  )
}

export default CountdownBadge
