import { useState } from 'react'
import useCalendarStore from '@/stores/useCalendarStore'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { EventModal } from '@/components/EventModal'

export default function WeekPage() {
  const { events, viewDate, setViewDate, categories } = useCalendarStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const start = startOfWeek(viewDate, { weekStartsOn: 0 })
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

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1))
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1))
  const handleTodayBtn = () => setViewDate(new Date())

  const todayEvents = events
    .filter((event) => isSameDay(new Date(event.start), new Date()))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return (
    <div className="h-full flex overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0 bg-white/50 dark:bg-[#1a2c2e]/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight capitalize">
              {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
            </h1>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <span className="material-icons-round text-lg leading-none">chevron_left</span>
              </button>
              <button
                onClick={handleTodayBtn}
                className="text-sm font-semibold px-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <span className="material-icons-round text-lg leading-none">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-sm w-64 shadow-sm focus:ring-2 focus:ring-primary/50 placeholder-slate-400 dark:text-white"
                placeholder="Pesquisar..."
                type="text"
              />
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <span className="material-icons-round text-xl leading-none">add</span>
              <span>Novo Evento</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-6">
          <div className="flex gap-6 min-w-max h-full">
            {days.map((day) => {
              const dayEvents = events.filter((e) => isSameDay(new Date(e.start), day))
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'w-72 md:w-80 flex flex-col rounded-[2.5rem] p-2 transition-all duration-300 group shadow-sm border',
                    isCurrentDay
                      ? 'bg-white dark:bg-[#1a2c2e] border-primary/40 ring-4 ring-primary/[0.05]'
                      : 'bg-white/60 dark:bg-[#1a2c2e]/60 border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-[#1a2c2e]',
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="p-6 text-center flex flex-col items-center">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">
                      {format(day, 'EEE', { locale: ptBR })}
                    </span>
                    <div className={cn(
                      'text-3xl font-bold w-14 h-14 flex items-center justify-center rounded-full transition-all',
                      isCurrentDay ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110' : 'text-slate-700 dark:text-slate-200 group-hover:text-primary group-hover:scale-105',
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>

                  <div className="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar">
                    {dayEvents.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 group-hover:opacity-50 transition-all py-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mb-3" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Livre</span>
                      </div>
                    ) : (
                      dayEvents.map((event) => {
                        const category = categories.find((c) => c.id === event.categoryId)
                        const color = category?.color || '#cbd5e1'

                        return (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(e, event.id)}
                            className={cn(
                              'event-bubble p-4 rounded-3xl border shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group/event',
                              event.completed && 'opacity-60 grayscale',
                            )}
                            style={{
                              backgroundColor: `${color}15`,
                              borderColor: `${color}30`,
                            }}
                          >
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                                  <span className="text-[10px] font-bold" style={{ color: color }}>
                                    {format(new Date(event.start), 'HH:mm')}
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                {event.title}
                              </div>
                              {event.description && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed italic">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                  <div className="p-4 opacity-0 group-hover:opacity-100 transition-all flex justify-center mt-auto">
                    <button className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center transition-all shadow-sm transform hover:scale-110 active:scale-95">
                      <span className="material-icons-round text-xl leading-none">add</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <aside className="w-80 lg:w-96 bg-white dark:bg-[#1a2c2e] border-l border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-y-auto p-8 shadow-card z-10 flex-shrink-0">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-white/10 dark:to-white/5 rounded-[2.5rem] p-8 mb-8 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-white/60 dark:bg-black/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-primary mb-6 backdrop-blur-sm leading-none border border-white/40">Momento Zen</span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Pausa necessária?</h2>
            <p className="text-slate-500 dark:text-slate-300 text-sm mb-8 leading-relaxed">Sincronize sua respiração e recarregue suas energias.</p>
            <div className="w-full h-40 mb-8 rounded-3xl bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center relative shadow-inner">
              <img
                alt="Meditação"
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2000ms]"
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
            </div>
            <button className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 transform active:scale-95 leading-none">
              <span className="material-icons-round text-xl leading-none">play_arrow</span>
              Iniciar foco
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
            Fluxo de Hoje
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse border-4 border-green-400/20"></span>
          </h3>
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
            {todayEvents.length > 0 ? (
              todayEvents.map((event, index) => (
                <div key={event.id} className={cn("flex gap-6 relative transition-all", index !== 0 && "opacity-60")}>
                  <div className="flex-shrink-0 w-10 text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {index === 0 ? 'Agora' : format(new Date(event.start), 'HH:mm')}
                    </span>
                  </div>
                  <div className={cn(
                    "w-3 h-3 rounded-full ring-8 ring-white dark:ring-[#1a2c2e] absolute left-[15px] top-1.5 z-10",
                    index === 0 ? "bg-primary shadow-lg shadow-primary/50" : "bg-slate-300 dark:bg-slate-700"
                  )}></div>
                  <div className={cn(
                    "flex-1 p-5 rounded-3xl shadow-sm border transition-all cursor-pointer",
                    index === 0
                      ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-soft"
                      : "bg-slate-50 dark:bg-slate-800/30 border-transparent"
                  )}
                    onClick={(e) => handleEventClick(e, event.id)}>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight">{event.title}</h4>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">
                      <span className="material-icons-round text-sm leading-none opacity-50">schedule</span>
                      {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic text-sm font-medium">Sua agenda está livre hoje.</div>
            )}
          </div>
        </div>

        <div className="mt-auto bg-[#fcf5c7]/20 dark:bg-yellow-900/10 p-6 rounded-3xl border border-yellow-100/50 dark:border-yellow-800/20">
          <span className="material-icons-round text-yellow-500/40 text-4xl mb-3 block leading-none">format_quote</span>
          <p className="text-base font-medium text-slate-700 dark:text-slate-300 italic mb-3 leading-relaxed">"O agora é tudo o que você tem de real."</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">— Eckhart Tolle</span>
        </div>
      </aside>

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
