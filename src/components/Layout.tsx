import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  Settings,
  Sun,
  Moon,
  Plus,
  User,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { MindfulMoment } from './MindfulMoment'
import useCalendarStore, { CalendarProvider } from '@/stores/useCalendarStore'
import { EventModal } from './EventModal'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

function MainLayout() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()
  const { viewDate } = useCalendarStore()
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  const navItems = [
    { icon: CalendarIcon, label: 'Semana', path: '/' },
    { icon: LayoutGrid, label: 'Meu Dia', path: '/day' },
    { icon: CalendarIcon, label: 'Mês', path: '/month' },
    { icon: LayoutGrid, label: 'Categorias', path: '/categories' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ]

  const currentDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  const NavContent = () => (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center gap-3 px-2">
        <img
          src="https://img.usecurling.com/i?q=mindful%20lotus&color=orange&shape=fill"
          alt="Logo"
          className="w-10 h-10"
        />
        <h1 className="text-xl font-bold tracking-tight text-primary">
          Mindful
          <br />
          <span className="text-foreground text-lg font-normal">Calendar</span>
        </h1>
      </div>

      <div className="flex-1 space-y-2 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 hover:bg-white/50 hover:pl-6',
              location.pathname === item.path
                ? 'bg-white text-primary font-bold shadow-soft'
                : 'text-muted-foreground',
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto space-y-6">
        <MindfulMoment />

        <Button
          className="w-full rounded-pill h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-soft hover:shadow-lg transition-all hover:-translate-y-1"
          onClick={() => setIsEventModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Novo Evento
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 p-6 border-r border-border/40 bg-sidebar hidden md:flex flex-col">
          <NavContent />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 px-6 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[80%] bg-sidebar border-none p-6"
                >
                  <NavContent />
                </SheetContent>
              </Sheet>
            )}
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-foreground capitalize">
                {currentDateFormatted}
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Respire fundo e organize seu dia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary/20 hover:text-secondary"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Avatar className="h-10 w-10 border-2 border-white shadow-soft cursor-pointer hover:scale-105 transition-transform">
              <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Bar (if needed, but sidebar drawer covers it mostly. Let's add a FAB for mobile add) */}
        {isMobile && (
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 z-50 animate-in zoom-in"
            onClick={() => setIsEventModalOpen(true)}
          >
            <Plus className="w-8 h-8" />
          </Button>
        )}
      </main>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  )
}

// Wrap layout with Provider to ensure access to store
export default function Layout() {
  return (
    <CalendarProvider>
      <MainLayout />
    </CalendarProvider>
  )
}
