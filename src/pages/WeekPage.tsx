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

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1))
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1))
  const handleTodayBtn = () => setViewDate(new Date())

  // Today's Flow for right sidebar
  const todayEvents = events
    .filter((event) => isSameDay(new Date(event.start), new Date()))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0 bg-white/50 dark:bg-[#1a2c2e]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight capitalize">
              {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
            </h1>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <span className="material-icons-round text-lg">chevron_left</span>
              </button>
              <button
                onClick={handleTodayBtn}
                className="text-sm font-semibold px-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <span className="material-icons-round text-lg">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-full text-sm w-64 shadow-sm focus:ring-2 focus:ring-primary/50 placeholder-slate-400 dark:text-white"
                placeholder="Search events..."
                type="text"
              />
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <span className="material-icons-round text-xl">add</span>
              <span>New Event</span>
            </button>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2">
          <div className="flex-1 overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 min-w-max h-full">
              {days.map((day, index) => {
                const dayEvents = events.filter((e) => isSameDay(new Date(e.start), day))
                const isCurrentDay = isToday(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'w-64 md:w-72 flex flex-col rounded-[2xl] p-2 transition-all duration-300 group hover:-translate-y-1 border',
                      isCurrentDay
                        ? 'bg-white dark:bg-[#1a2c2e] shadow-md border-primary/50 ring-2 ring-primary/20'
                        : 'bg-white/60 dark:bg-[#1a2c2e]/60 hover:bg-white dark:hover:bg-[#1a2c2e] border-transparent hover:border-primary/20',
                    )}
                    onClick={() => handleDayClick(day)}
                  >
                    <div
                      className={cn(
                        'p-4 text-center rounded-t-2xl flex flex-col items-center',
                      )}
                    >
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {format(day, 'EEE', { locale: ptBR })}
                      </span>
                      <div
                        className={cn(
                          'text-3xl font-bold mt-1 w-10 h-10 flex items-center justify-center rounded-full',
                          isCurrentDay ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-700 dark:text-slate-200',
                        )}
                      >
                        {format(day, 'd')}
                      </div>
                    </div>

                    <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                      {dayEvents.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                          <div className="w-2 h-2 rounded-full bg-slate-300 mb-2" />
                          <span className="text-xs text-slate-400 italic">
                            Livre
                          </span>
                        </div>
                      ) : (
                        dayEvents.map((event) => {
                          const category = categories.find(
                            (c) => c.id === event.categoryId,
                          )
                          const color = category?.color || '#cbd5e1'

                          return (
                            <div
                              key={event.id}
                              onClick={(e) => handleEventClick(e, event.id)}
                              className={cn(
                                'event-bubble p-3 rounded-xl border border-transparent shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden',
                                event.completed && 'opacity-60 grayscale',
                              )}
                              style={{
                                backgroundColor: `${color}20`,
                                borderColor: `${color}40`,
                              }}
                            >
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                                  <span className="text-[10px] font-bold" style={{ color: color }}>
                                    {format(new Date(event.start), 'HH:mm')}
                                  </span>
                                </div>
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                  {event.title}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                      <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center transition-all">
                        <span className="material-icons-round text-sm">add</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Mindful Moment) */}
      <aside className="w-80 lg:w-96 bg-white dark:bg-[#1a2c2e] border-l border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-y-auto p-8 shadow-card z-10 flex-shrink-0">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-white/10 dark:to-white/5 rounded-3xl p-6 mb-8 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/60 dark:bg-black/20 rounded-full text-[10px] font-bold tracking-wider uppercase text-primary mb-4 backdrop-blur-sm">Mindful Moment</span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Time to breathe?</h2>
            <p className="text-slate-500 dark:text-slate-300 text-sm mb-6 leading-relaxed">Take 5 minutes to reset your mind before your next meeting.</p>
            <div className="w-full h-32 mb-6 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center relative">
              <img
                alt="Abstract illustration"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALP0jXBtCB2kY2RpHnbN0UIUtKa5RBmgh2A3FVvIM4hdOtmet3HvhqCq20RaWRUS7fifvtJ-NnbgR82mNZimNXisTpLeyIPYxEUI2eA9SsKVYnimgIEEFfIDmHYSiW0RTSOfv6wfPy6D4r7cdwyx1y7EsxVAgvnsih2NtvMJQAqSWWp3yaTNPiqtesZkSjhm61W4c3PjjOZ1ncTgtvwaUoCY91HkdShtfMrudYjmG9T8oWb9sn4-phAMyfi08MHxgG_d0G4gepeok"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
            </div>
            <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
              <span className="material-icons-round text-lg">play_arrow</span>
              Start 5-min Focus
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            Today's Flow
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </h3>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
            {todayEvents.length > 0 ? (
              todayEvents.map((event, index) => (
                <div key={event.id} className={cn("flex gap-4 relative", index !== 0 && "opacity-60 hover:opacity-100 transition-opacity")}>
                  <div className="flex-shrink-0 w-10 text-right">
                    <span className="text-xs font-bold text-slate-400">
                      {index === 0 ? 'Now' : format(new Date(event.start), 'HH:mm')}
                    </span>
                  </div>
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#1a2c2e] absolute left-[15px] top-1.5 z-10",
                    index === 0 ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                  )}></div>
                  <div className={cn(
                    "flex-1 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border",
                    index === 0
                      ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
                      : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  )}>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                      <span className="material-icons-round text-sm">schedule</span>
                      {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 italic text-sm">No events for today.</div>
            )}
          </div>
        </div>

        <div className="mt-auto bg-muted-yellow/30 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
          <span className="material-icons-round text-yellow-600/50 dark:text-yellow-500/50 text-3xl mb-2 block">format_quote</span>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic mb-2">"The present moment is filled with joy and happiness. If you are attentive, you will see it."</p>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">— Thich Nhat Hanh</span>
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
