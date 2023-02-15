import { formatDuration, intervalToDuration, isPast, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'

const useCountdownDisplay = (expirationDate?: string | Date) => {
  const [timeleft, setTimeleft] = useState<string>()
  useEffect(() => {
    const date = expirationDate
    if (!date) return

    const timeout = setInterval(() => {
      const targeted = date instanceof Date ? date : parseISO(date)
      if (isPast(targeted)) {
        clearTimeout(timeout)
      }
      const duration = intervalToDuration({
        start: targeted,
        end: new Date(),
      })

      setTimeleft(formatDuration(duration))
    }, 1000)

    return () => {
      clearInterval(timeout)
    }
  }, [expirationDate])
  return timeleft
}

export default useCountdownDisplay
