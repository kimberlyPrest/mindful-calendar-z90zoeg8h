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
  isToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { EventModal } from '@/components/EventModal'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Play,
  Quote,
  Clock,
} from 'lucide-react'

export default function MonthPage() {
  const { events, viewDate, setViewDate, categories } = useCalendarStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1))
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1))
  const handleTodayBtn = () => setViewDate(new Date())

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setIsCreateOpen(true)
  }

  const handleEventClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedEventId(id)
    setIsCreateOpen(true)
  }

  const todayEvents = events
    .filter((event) => isSameDay(new Date(event.start), new Date()))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return (
    <div className="h-full flex overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
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
                <ChevronLeft className="w-5 h-5" />
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
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-sm w-64 shadow-sm focus:ring-2 focus:ring-primary/50 placeholder-slate-400 dark:text-white"
                placeholder="Pesquisar eventos..."
                type="text"
              />
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Evento</span>
            </button>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-bold text-slate-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-4 min-h-[800px] auto-rows-fr">
            {days.map((day) => {
              const dayEvents = events.filter((e) =>
                isSameDay(new Date(e.start), day),
              )
              const isOutside = !isSameMonth(day, monthStart)
              const isTodayDay = isToday(day)

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'date-cell rounded-2xl p-2 flex flex-col gap-2 min-h-[140px] shadow-sm border border-transparent transition-all relative group cursor-pointer',
                    isOutside
                      ? 'bg-slate-50/50 dark:bg-white/5 opacity-40'
                      : 'bg-white dark:bg-[#1a2c2e] hover:border-primary/20',
                    isTodayDay && 'border-2 border-primary/50 shadow-md',
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex justify-between items-center px-1">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        isTodayDay
                          ? 'w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30'
                          : 'text-slate-700 dark:text-slate-200',
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <button className="add-btn opacity-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                    {dayEvents.map((event) => {
                      const category = categories.find(
                        (c) => c.id === event.categoryId,
                      )
                      const color = category?.color || '#cbd5e1'

                      return (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(e, event.id)}
                          className="event-bubble p-2 rounded-xl border cursor-pointer relative overflow-hidden"
                          style={{
                            backgroundColor: `${color}20`,
                            borderColor: `${color}40`,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: color }}
                            ></span>
                            <span
                              className="text-[9px] font-bold"
                              style={{ color: color }}
                            >
                              {format(new Date(event.start), 'HH:mm')}
                            </span>
                          </div>
                          <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                            {event.title}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar (Mindful Moment) */}
      <aside className="w-80 lg:w-96 bg-white dark:bg-[#1a2c2e] border-l border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-y-auto p-8 shadow-card z-10 flex-shrink-0">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-white/10 dark:to-white/5 rounded-3xl p-6 mb-8 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/60 dark:bg-black/20 rounded-full text-[10px] font-bold tracking-wider uppercase text-primary mb-4 backdrop-blur-sm">
              Mindful Moment
            </span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Time to breathe?
            </h2>
            <p className="text-slate-500 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              Take 5 minutes to reset your mind before your next meeting.
            </p>
            <div className="w-full h-32 mb-6 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center relative">
              <img
                alt="Meditação"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
            </div>
            <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 transform active:scale-95 leading-none">
              <Play className="w-5 h-5" />
              Iniciar foco de 5m
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            Fluxo de Hoje
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </h3>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
            {todayEvents.length > 0 ? (
              todayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={cn(
                    'flex gap-4 relative',
                    index !== 0 &&
                      'opacity-60 hover:opacity-100 transition-opacity',
                  )}
                >
                  <div className="flex-shrink-0 w-10 text-right">
                    <span className="text-xs font-bold text-slate-400">
                      {index === 0
                        ? 'Now'
                        : format(new Date(event.start), 'HH:mm')}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#1a2c2e] absolute left-[15px] top-1.5 z-10',
                      index === 0
                        ? 'bg-primary'
                        : 'bg-slate-300 dark:bg-slate-600',
                    )}
                  ></div>
                  <div
                    className={cn(
                      'flex-1 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border',
                      index === 0
                        ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700',
                    )}
                  >
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                      <Clock className="w-4 h-4" />
                      {format(new Date(event.start), 'HH:mm')} -{' '}
                      {format(new Date(event.end), 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 italic text-sm">
                No events for today.
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto bg-muted-yellow/30 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
          <Quote className="text-yellow-600/50 dark:text-yellow-500/50 w-8 h-8 mb-2 block" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic mb-2">
            "The present moment is filled with joy and happiness. If you are
            attentive, you will see it."
          </p>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            — Thich Nhat Hanh
          </span>
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
