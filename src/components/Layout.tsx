import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { CalendarProvider } from '@/stores/useCalendarStore'

function MainLayout() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-600 dark:text-slate-300 font-display h-screen flex overflow-hidden selection:bg-primary/30">
      {/* Left Navigation Rail (Always Visible) */}
      <nav className="w-20 lg:w-24 bg-white dark:bg-[#1a2c2e] border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-8 z-20 shadow-sm flex-shrink-0">
        {/* Logo Area */}
        <div className="mb-12">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-icons-round text-3xl">spa</span>
          </div>
        </div>
        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-6 w-full px-4">
          <Link
            to="/"
            className={cn(
              "group w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all",
              location.pathname === "/"
                ? "text-primary bg-primary/10 font-bold"
                : "text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5"
            )}
          >
            <span className="material-icons-round text-2xl mb-1">calendar_today</span>
            <span className="text-[10px]">Month</span>
          </Link>

          <Link
            to="/focus"
            className={cn(
              "group w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all",
              location.pathname === "/focus"
                ? "text-primary bg-primary/10 font-bold"
                : "text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5"
            )}
          >
            <span className="material-icons-round text-2xl mb-1">pie_chart_outline</span>
            <span className="text-[10px]">Focus</span>
          </Link>
        </div>
        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-6 items-center">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="relative group cursor-pointer">
            <img
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-md object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgZLIrdIyU2wHbNBCHMll_EPsXg_BD0shxwwf_GLpTHoLOZu1ea5caOGLYcqoAe8Xaii77e56Pf1n06YLcohuLmHpM63lVQDl0cg_jowZXbxjyVpulBkpyhSMsUoN-5bRurv6aFiGcME7hy3WhpoNdcJKmFtk0a3QWTNVAC2fWjr-dGjpUwEHI_-t9clufUbmdYcWLwYgt6u6RLSJm_wDECQorLL5Okkxuigb48lwwYr4oNrMneariabpZvu81q10p0ioo-MPMRLM"
            />
            <div className="absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full bottom-0 right-0"></div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 overflow-hidden relative">
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
