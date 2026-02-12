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
            color: 'bg-[#ccebf3]/30',
            borderColor: 'border-[#ccebf3]/50',
            tags: ['Mindful', 'Solo'],
            icon: 'self_improvement'
        },
        {
            id: 2,
            title: 'Design Sync',
            description: 'with Sarah & Mike',
            time: '12:00 PM - 01:00 PM',
            top: '280px',
            height: '80px',
            color: 'bg-[#e0dcf5]/30',
            borderColor: 'border-[#e0dcf5]/50',
            icon: 'groups',
            avatars: [
                'https://i.pravatar.cc/150?u=sarah',
                'https://i.pravatar.cc/150?u=mike'
            ]
        },
        {
            id: 3,
            title: 'Lunch Break',
            description: 'Offline',
            time: '01:30 PM - 02:30 PM',
            top: '380px',
            height: '80px',
            color: 'bg-[#fcf5c7]/30',
            borderColor: 'border-[#fcf5c7]/50',
            icon: 'restaurant'
        },
        {
            id: 4,
            title: 'Brainstorming',
            description: 'New marketing campaign ideas. Bring sketches.',
            time: '03:00 PM - 04:30 PM',
            top: '480px',
            height: '110px',
            color: 'bg-[#ffd8be]/30',
            borderColor: 'border-[#ffd8be]/50',
            icon: 'lightbulb'
        }
    ]

    return (
        <div className="h-full flex flex-col bg-background-light dark:bg-background-dark p-6 lg:p-10 animate-fade-in overflow-hidden">
            {/* Top Greeting Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2 leading-none">
                        {format(new Date(), 'EEEE, d MMM', { locale: ptBR })}
                    </div>
                    <h1 className="text-5xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
                        Olá, Alex.
                    </h1>
                    <p className="text-2xl text-slate-400 font-medium">
                        O dia hoje é sobre equilíbrio.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-soft">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sentindo:</span>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-500 hover:scale-110 active:scale-95 transition-all">
                            <span className="material-icons-round text-lg leading-none">eco</span>
                        </button>
                        <button className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 hover:scale-110 active:scale-95 transition-all">
                            <span className="material-icons-round text-lg leading-none">bolt</span>
                        </button>
                        <button className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-all">
                            <span className="material-icons-round text-lg leading-none">gps_fixed</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-10 overflow-hidden">
                {/* Left Column - Mini Sidebar */}
                <div className="w-72 flex flex-col gap-8 flex-shrink-0">
                    {/* Mini Calendar */}
                    <div className="bg-white dark:bg-[#1a2c2e] p-6 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-slate-800 dark:text-white leading-none">Outubro 2023</span>
                            <div className="flex gap-2">
                                <button className="text-slate-400 hover:text-primary transition-colors leading-none pr-1">
                                    <span className="material-icons-round text-lg leading-none">chevron_left</span>
                                </button>
                                <button className="text-slate-400 hover:text-primary transition-colors leading-none">
                                    <span className="material-icons-round text-lg leading-none">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-3 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">
                            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                        </div>
                        <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold">
                            {[28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((day, i) => (
                                <span key={i} className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer leading-none",
                                    day === 8 ? "bg-primary text-white font-bold shadow-lg shadow-primary/30 scale-110" :
                                        i < 3 ? "text-slate-200 dark:text-slate-700" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-90"
                                )}>
                                    {day}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hydration Check */}
                    <div className="flex-1 bg-gradient-to-b from-[#fffaf5] to-[#fff1e6] dark:from-orange-900/10 dark:to-orange-900/5 p-8 rounded-[2.5rem] border border-orange-100/50 dark:border-orange-800/10 flex flex-col items-center text-center relative overflow-hidden group shadow-soft">
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Bebeu água?</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                                Você está em foco profundo há 2 horas. Que tal uma pausa para hidratar?
                            </p>

                            <div className="relative mb-auto pb-6">
                                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center relative transform group-hover:scale-110 transition-transform">
                                    <span className="material-icons-round text-blue-400 text-5xl animate-bounce leading-none">water_drop</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setWaterCount(prev => prev + 1)}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 text-sm leading-none"
                            >
                                Bebi água! ({waterCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Timeline */}
                <div className="flex-1 bg-white/50 dark:bg-[#1a2c2e]/50 backdrop-blur-md rounded-[3rem] border border-white dark:border-slate-800 p-10 flex flex-col relative overflow-hidden shadow-soft">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Horário</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Sessões de Foco</div>
                    </div>

                    <div className="flex-1 relative overflow-y-auto pr-4 custom-scrollbar">
                        {/* Timeline Grid Lines */}
                        {hours.map((hour) => (
                            <div key={hour} className="relative h-24 border-t border-slate-100 dark:border-slate-800/50 flex transition-colors">
                                <span className="absolute -top-3.5 left-0 text-[10px] font-bold text-slate-300 uppercase tracking-tighter leading-none">
                                    {hour.toString().padStart(2, '0')}:00 AM
                                </span>
                            </div>
                        ))}

                        {/* Current Time Indicator */}
                        <div className="absolute left-0 right-0 z-20 flex items-center gap-4 pointer-events-none" style={{ top: '240px' }}>
                            <div className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl leading-none">10:45 AM</div>
                            <div className="flex-1 h-0.5 bg-primary/40 rounded-full"></div>
                        </div>

                        {/* Focus Events */}
                        <div className="absolute inset-0 pl-20 pt-4 pr-2">
                            {focusEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "absolute left-4 right-4 rounded-[2.5rem] border p-6 flex items-center gap-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden border-2",
                                        event.color,
                                        event.borderColor
                                    )}
                                    style={{ top: (parseInt(event.top) * 1.2).toString() + 'px', height: (parseInt(event.height) * 1.2).toString() + 'px' }}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-bold text-primary dark:text-white uppercase tracking-widest leading-none bg-white/40 dark:bg-black/20 px-2 py-1 rounded-md">
                                                {event.time}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2 leading-tight">{event.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-4 font-medium opacity-80">{event.description}</p>

                                        <div className="flex items-center gap-2">
                                            {event.tags?.map(tag => (
                                                <span key={tag} className="px-3 py-1.5 bg-white/60 dark:bg-black/30 rounded-xl text-[10px] font-bold text-primary uppercase tracking-tighter leading-none border border-primary/10">
                                                    {tag}
                                                </span>
                                            ))}
                                            {event.avatars && (
                                                <div className="flex -space-x-3 ml-3">
                                                    {event.avatars.map((avatar, i) => (
                                                        <img key={i} src={avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-20 h-20 bg-white/90 dark:bg-slate-800/90 rounded-[1.5rem] flex items-center justify-center text-primary shadow-soft transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <span className="material-icons-round text-4xl leading-none">{event.icon}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Event FAB */}
                    <button className="absolute bottom-10 right-10 w-16 h-16 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center transition-all transform active:scale-90 hover:scale-105 z-30 group">
                        <span className="material-icons-round text-4xl leading-none group-hover:rotate-90 transition-transform">add</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FocusPage
