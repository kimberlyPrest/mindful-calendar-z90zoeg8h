import { useState } from 'react'
import useCalendarStore from '@/stores/useCalendarStore'
import { format, addHours, startOfDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { EventModal } from '@/components/EventModal'

export default function DayPage() {
  const { events, viewDate, categories, toggleEventCompletion } =
    useCalendarStore()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const dayEvents = events
    .filter((e) => isSameDay(e.start, viewDate))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const hours = Array.from({ length: 24 }).map((_, i) => i)

  const handleEventClick = (id: string) => {
    setSelectedEventId(id)
    setIsEditOpen(true)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Meu Dia</h2>
        <div className="text-right">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            Foco de Hoje
          </div>
          <div className="font-semibold">
            {dayEvents.length} tarefas planejadas
          </div>
        </div>
      </div>

      {dayEvents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-fade-in-up">
          <img
            src="https://img.usecurling.com/p/400/300?q=meditation%20illustration&dpr=2"
            alt="Resting"
            className="w-64 h-64 object-contain mb-6 opacity-80 mix-blend-multiply dark:mix-blend-normal"
          />
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Tempo para você
          </h3>
          <p className="text-muted-foreground">
            Que tal uma meditação ou uma caminhada?
          </p>
        </div>
      ) : (
        <div className="relative flex-1 bg-white/50 dark:bg-card/30 rounded-[32px] p-6 overflow-y-auto shadow-inner">
          {/* Simple Timeline View */}
          <div className="space-y-4">
            {dayEvents.map((event) => {
              const category = categories.find((c) => c.id === event.categoryId)
              return (
                <div
                  key={event.id}
                  className="group flex items-start gap-4 animate-slide-up"
                >
                  <div className="w-16 pt-2 text-right text-sm text-muted-foreground font-medium">
                    {format(event.start, 'HH:mm')}
                  </div>

                  <div className="relative flex-1">
                    <div
                      className={cn(
                        'p-4 rounded-[20px] transition-all duration-300 border-l-4 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-between bg-white dark:bg-card',
                        event.completed && 'opacity-60 bg-muted',
                      )}
                      style={{ borderLeftColor: category?.color || '#ccc' }}
                      onClick={() => handleEventClick(event.id)}
                    >
                      <div>
                        <h4
                          className={cn(
                            'font-bold text-lg',
                            event.completed &&
                              'line-through decoration-primary/50',
                          )}
                        >
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white"
                            style={{
                              backgroundColor: category?.color || '#ccc',
                            }}
                          >
                            {category?.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(event.end, 'HH:mm')}
                          </span>
                        </div>
                      </div>

                      <div
                        className="p-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleEventCompletion(event.id)
                        }}
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <EventModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedEventId(null)
        }}
        eventId={selectedEventId || undefined}
      />
    </div>
  )
}
