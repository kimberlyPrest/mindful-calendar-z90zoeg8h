import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  parseISO,
} from 'date-fns'

// Types
export type EventCategory = 'Work' | 'Personal' | 'Health' | 'Social' | 'Other'

export interface Category {
  id: string
  name: string
  color: string // Hex code or Tailwind class
  type: EventCategory
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  categoryId: string
  completed?: boolean
}

interface CalendarState {
  events: CalendarEvent[]
  categories: Category[]
  viewDate: Date
  selectedDate: Date | null

  // Actions
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  toggleEventCompletion: (id: string) => void

  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void

  setViewDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void

  // Helpers
  getEventsForDate: (date: Date) => CalendarEvent[]
}

const CalendarContext = createContext<CalendarState | undefined>(undefined)

const initialCategories: Category[] = [
  { id: '1', name: 'Trabalho', color: '#FF8C5F', type: 'Work' }, // Orange
  { id: '2', name: 'Foco', color: '#49A1FF', type: 'Work' }, // Blue
  { id: '3', name: 'Saúde', color: '#7ED321', type: 'Health' }, // Green
  { id: '4', name: 'Social', color: '#F4A261', type: 'Social' }, // Peach
  { id: '5', name: 'Lazer', color: '#E76F51', type: 'Personal' }, // Burnt Sienna
]

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Meditação Matinal',
    description: 'Começar o dia com calma.',
    start: new Date(new Date().setHours(7, 0, 0, 0)),
    end: new Date(new Date().setHours(7, 30, 0, 0)),
    categoryId: '3',
    completed: false,
  },
  {
    id: '2',
    title: 'Reunião de Design',
    description: 'Discutir novas features.',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    categoryId: '1',
    completed: false,
  },
  {
    id: '3',
    title: 'Almoço com Amigos',
    start: new Date(new Date().setHours(12, 30, 0, 0)),
    end: new Date(new Date().setHours(13, 30, 0, 0)),
    categoryId: '4',
    completed: false,
  },
]

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [viewDate, setViewDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, updatedFields: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)),
    )
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const toggleEventCompletion = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)),
    )
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
    )
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((e) => isSameDay(e.start, date))
  }

  return React.createElement(
    CalendarContext.Provider,
    {
      value: {
        events,
        categories,
        viewDate,
        selectedDate,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventCompletion,
        addCategory,
        updateCategory,
        deleteCategory,
        setViewDate,
        setSelectedDate,
        getEventsForDate,
      },
    },
    children,
  )
}

export default function useCalendarStore() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendarStore must be used within a CalendarProvider')
  }
  return context
}
