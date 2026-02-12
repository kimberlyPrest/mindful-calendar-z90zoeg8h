import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Smile, Wind } from 'lucide-react'

export const MindfulMoment = () => {
  const [isBreathing, setIsBreathing] = useState(false)
  const [message, setMessage] = useState('Respire...')

  useEffect(() => {
    if (isBreathing) {
      const interval = setInterval(() => {
        setMessage((prev) =>
          prev === 'Inspire...' ? 'Expire...' : 'Inspire...',
        )
      }, 4000)
      return () => clearInterval(interval)
    } else {
      setMessage('Pausa para respirar?')
    }
  }, [isBreathing])

  return (
    <div className="bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-soft border border-border/50">
      <div
        className={cn(
          'w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-2 cursor-pointer transition-all duration-4000 ease-in-out',
          isBreathing && 'scale-125 bg-accent/30',
        )}
        onClick={() => setIsBreathing(!isBreathing)}
      >
        {isBreathing ? (
          <Wind className="w-8 h-8 animate-pulse" />
        ) : (
          <Smile className="w-8 h-8" />
        )}
      </div>
      <h4 className="font-bold text-sm text-foreground mb-1">
        Momento Consciente
      </h4>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  )
}
