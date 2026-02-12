import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { CalendarProvider } from '@/stores/useCalendarStore'

function MainLayout() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { to: '/', icon: 'calendar_today', label: 'Mês' },
    { to: '/focus', icon: 'pie_chart_outline', label: 'Foco' },
  ]

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-display h-screen flex overflow-hidden selection:bg-primary/20 transition-colors duration-300">
      {/* Left Navigation Rail */}
      <nav className="w-20 lg:w-24 bg-white dark:bg-[#1a2c2e] border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-10 z-20 shadow-sm flex-shrink-0 transition-colors duration-300">
        {/* Logo Area */}
        <div className="mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 transform hover:rotate-6 transition-transform cursor-pointer">
            <span className="material-icons-round text-3xl leading-none">spa</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-8 w-full px-3 lg:px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group w-full aspect-square rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-300 relative",
                  isActive
                    ? "text-primary bg-primary/[0.08] shadow-inner"
                    : "text-slate-300 dark:text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "material-icons-round text-2xl mb-1 leading-none transition-transform group-active:scale-90",
                  isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                )}>
                  {item.icon}
                </span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest leading-none transition-all",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/40" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-6 items-center">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 active:scale-90"
          >
            <span className="material-icons-round text-xl leading-none">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-700 shadow-md p-0.5 overflow-hidden transition-all group-hover:border-primary/50 group-hover:shadow-lg">
              <img
                alt="Avatar"
                className="w-full h-full rounded-[0.6rem] object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
              />
            </div>
            <div className="absolute w-3.5 h-3.5 bg-green-400 border-[3px] border-white dark:border-slate-900 rounded-full -bottom-1 -right-1 shadow-sm"></div>
          </div>
        </div>
      </nav>

      {/* Main Framework */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default function Layout() {
  return (
    <CalendarProvider>
      <MainLayout />
    </CalendarProvider>
  )
}
