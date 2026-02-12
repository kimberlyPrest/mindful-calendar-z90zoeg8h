import { useState } from 'react'
import useCalendarStore from '@/stores/useCalendarStore'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { EventModal } from '@/components/EventModal'

export default function WeekPage() {
  const { events, viewDate, categories } = useCalendarStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const start = startOfWeek(viewDate, { weekStartsOn: 0 }) // Sunday start
  const end = endOfWeek(viewDate, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start, end })

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsCreateOpen(true)
  }

  const handleEventClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedEventId(id)
    setIsCreateOpen(true)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Esta Semana</h2>
        <div className="text-sm text-muted-foreground">
          {format(start, "d 'de' MMMM", { locale: ptBR })} -{' '}
          {format(end, "d 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-4 min-w-max h-full">
          {days.map((day, index) => {
            const dayEvents = events.filter((e) => isSameDay(e.start, day))
            const isCurrentDay = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'w-64 md:w-72 flex flex-col rounded-[24px] transition-all duration-300 group hover:-translate-y-1',
                  isCurrentDay
                    ? 'bg-white dark:bg-card shadow-soft ring-2 ring-primary/20'
                    : 'bg-white/60 dark:bg-card/60 hover:bg-white dark:hover:bg-card',
                )}
                onClick={() => handleDayClick(day)}
              >
                <div
                  className={cn(
                    'p-4 border-b border-border/50 text-center rounded-t-[24px]',
                    isCurrentDay && 'bg-primary/10',
                  )}
                >
                  <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    {format(day, 'EEEE', { locale: ptBR })}
                  </span>
                  <div
                    className={cn(
                      'text-4xl font-bold mt-1',
                      isCurrentDay ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                  {dayEvents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mb-2" />
                      <span className="text-xs text-muted-foreground italic">
                        Livre
                      </span>
                    </div>
                  ) : (
                    dayEvents.map((event) => {
                      const category = categories.find(
                        (c) => c.id === event.categoryId,
                      )
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(e, event.id)}
                          className={cn(
                            'p-3 rounded-[16px] text-sm font-medium cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95 animate-fade-in text-white relative overflow-hidden',
                            event.completed && 'opacity-60 grayscale',
                          )}
                          style={{ backgroundColor: category?.color || 'gray' }}
                        >
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold truncate">
                                {event.title}
                              </span>
                            </div>
                            <div className="text-xs opacity-90 font-light">
                              {format(event.start, 'HH:mm')} -{' '}
                              {format(event.end, 'HH:mm')}
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl" />
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                  <div className="w-8 h-1 rounded-full bg-muted-foreground/20" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <EventModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          setSelectedEventId(null)
        }}
        initialDate={selectedDate}
        eventId={selectedEventId || undefined}
      />
    </div>
  )
}
