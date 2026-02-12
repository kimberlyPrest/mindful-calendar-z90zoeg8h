import { useState } from 'react'
import useCalendarStore from '@/stores/useCalendarStore'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventModal } from '@/components/EventModal'

export default function MonthPage() {
  const { events, viewDate, setViewDate, categories } = useCalendarStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1))
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1))

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setIsCreateOpen(true)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-primary capitalize">
            {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex items-center gap-1 bg-white dark:bg-card rounded-full p-1 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-card rounded-[32px] shadow-soft p-6 flex flex-col">
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-2">
          {days.map((day, idx) => {
            const dayEvents = events.filter((e) => isSameDay(e.start, day))
            const isCurrentMonth = isSameMonth(day, monthStart)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'relative rounded-[20px] p-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-start pt-3 gap-1 hover:bg-muted/50',
                  !isCurrentMonth && 'opacity-30 grayscale',
                  isSameDay(day, new Date()) &&
                    'bg-primary/5 ring-1 ring-primary',
                )}
                onClick={() => handleDayClick(day)}
              >
                <span
                  className={cn(
                    'text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full',
                    isSameDay(day, new Date()) &&
                      'bg-primary text-white font-bold',
                  )}
                >
                  {format(day, 'd')}
                </span>

                <div className="flex flex-wrap gap-1 justify-center max-w-full px-1">
                  {dayEvents.slice(0, 4).map((event) => {
                    const category = categories.find(
                      (c) => c.id === event.categoryId,
                    )
                    return (
                      <div
                        key={event.id}
                        className="w-2 h-2 rounded-full shadow-sm"
                        style={{ backgroundColor: category?.color || 'gray' }}
                        title={event.title}
                      />
                    )
                  })}
                  {dayEvents.length > 4 && (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 flex items-center justify-center text-[5px]">
                      +
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <EventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        initialDate={selectedDate}
      />
    </div>
  )
}
