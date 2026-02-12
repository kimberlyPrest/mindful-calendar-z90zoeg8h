import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const FocusPage = () => {
  const [waterCount, setWaterCount] = useState(0)

  const hours = Array.from({ length: 11 }, (_, i) => i + 8) // 08 AM to 06 PM

  const focusEvents = [
    {
      id: 1,
      title: 'Deep Work Phase',
      description: 'Focus on the Q4 strategy document. No interruptions.',
      time: '09:00 AM - 11:00 AM',
      top: '100px',
      height: '140px',
      color: 'bg-soft-blue/30',
      borderColor: 'border-soft-blue/50',
      tags: ['Mindful', 'Solo'],
      icon: 'self_improvement',
    },
    {
      id: 2,
      title: 'Design Sync',
      description: 'with Sarah & Mike',
      time: '12:00 PM - 01:00 PM',
      top: '280px',
      height: '80px',
      color: 'bg-calm-purple/30',
      borderColor: 'border-calm-purple/50',
      icon: 'groups',
      avatars: [
        'https://i.pravatar.cc/150?u=sarah',
        'https://i.pravatar.cc/150?u=mike',
      ],
    },
    {
      id: 3,
      title: 'Lunch Break',
      description: 'Offline',
      time: '01:30 PM - 02:30 PM',
      top: '380px',
      height: '70px',
      color: 'bg-muted-yellow/30',
      borderColor: 'border-muted-yellow/50',
      icon: 'restaurant',
    },
    {
      id: 4,
      title: 'Brainstorming',
      description: 'New marketing campaign ideas. Bring sketches.',
      time: '03:00 PM - 04:30 PM',
      top: '480px',
      height: '110px',
      color: 'bg-warm-orange/30',
      borderColor: 'border-warm-orange/50',
      icon: 'lightbulb',
    },
  ]

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-hidden">
      {/* Top Greeting Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            {format(new Date(), 'EEEE, MMM d', { locale: ptBR })}
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Good Morning, Alex.
          </h1>
          <p className="text-2xl text-slate-400 font-medium">
            Today is about balance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Feeling:
          </span>
          <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:scale-110 transition-transform">
            <span className="material-icons-round text-sm">eco</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 hover:scale-110 transition-transform">
            <span className="material-icons-round text-sm">bolt</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:scale-110 transition-transform">
            <span className="material-icons-round text-sm">gps_fixed</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left Column - Local Sidebar */}
        <div className="w-64 flex flex-col gap-6 flex-shrink-0">
          {/* Mini Calendar */}
          <div className="bg-white dark:bg-[#1a2c2e] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                October 2023
              </span>
              <div className="flex gap-1">
                <button className="text-slate-400 hover:text-primary">
                  <span className="material-icons-round text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="text-slate-400 hover:text-primary">
                  <span className="material-icons-round text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium">
              {[28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((day, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer',
                    day === 8
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary/30'
                      : i < 3
                        ? 'text-slate-200 dark:text-slate-700'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5',
                  )}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Hydration Check */}
          <div className="flex-1 bg-gradient-to-b from-[#fffaf5] to-[#fff1e6] dark:from-orange-900/10 dark:to-orange-900/5 p-6 rounded-[2rem] border border-orange-100 dark:border-orange-800/30 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                Hydration Check
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                You've been in deep focus mode for 2 hours. Time for a water
                break?
              </p>

              <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center relative">
                  <span className="material-icons-round text-blue-400 text-4xl animate-bounce">
                    water_drop
                  </span>
                </div>
              </div>

              <button
                onClick={() => setWaterCount((prev) => prev + 1)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 text-sm"
              >
                I drank water! ({waterCount})
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="flex-1 bg-white/50 dark:bg-[#1a2c2e]/50 backdrop-blur-sm rounded-[2.5rem] border border-white dark:border-slate-800 p-8 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Time
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Events
            </div>
          </div>

          <div className="flex-1 relative overflow-y-auto pr-4 custom-scrollbar">
            {/* Timeline Grid Lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative h-20 border-t border-slate-100 dark:border-slate-800/50 flex"
              >
                <span className="absolute -top-3 left-0 text-[10px] font-bold text-slate-300 uppercase">
                  {hour.toString().padStart(2, '0')} AM
                </span>
              </div>
            ))}

            {/* Current Time Indicator */}
            <div
              className="absolute left-0 right-0 z-20 flex items-center gap-2 pointer-events-none"
              style={{ top: '220px' }}
            >
              <div className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                10:45 AM
              </div>
              <div className="flex-1 h-0.5 bg-primary/30"></div>
            </div>

            {/* Focus Events */}
            <div className="absolute inset-0 pl-16 pt-4">
              {focusEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'absolute left-4 right-4 rounded-[2rem] border p-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden',
                    event.color,
                    event.borderColor,
                  )}
                  style={{ top: event.top, height: event.height }}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                      {event.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-3">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2">
                      {event.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-white/50 dark:bg-black/20 rounded-md text-[10px] font-bold text-primary uppercase tracking-tighter"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.avatars && (
                        <div className="flex -space-x-2 ml-2">
                          {event.avatars.map((avatar, i) => (
                            <img
                              key={i}
                              src={avatar}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-14 h-14 bg-white/80 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center text-primary shadow-sm transform group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-2xl">
                      {event.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Event FAB */}
          <button className="absolute bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center transition-all transform active:scale-95 z-30 group">
            <span className="material-icons-round text-3xl group-hover:rotate-90 transition-transform">
              add
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FocusPage
