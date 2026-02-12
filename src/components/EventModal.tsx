import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Clock,
  Type,
  AlignLeft,
  Bell,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import useCalendarStore from '@/stores/useCalendarStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const eventSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  startTime: z.string().min(1, 'Hora de início é obrigatória'),
  endTime: z.string().min(1, 'Hora de término é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().optional(),
  reminder: z.boolean().default(false),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
  eventId?: string
}

export const EventModal = ({
  isOpen,
  onClose,
  initialDate,
  eventId,
}: EventModalProps) => {
  const { categories, addEvent, updateEvent, events } = useCalendarStore()
  const [isAnimating, setIsAnimating] = useState(false)

  const existingEvent = eventId ? events.find((e) => e.id === eventId) : null

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      categoryId: categories[0]?.id || '',
      description: '',
      reminder: false,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        form.reset({
          title: existingEvent.title,
          date: format(existingEvent.start, 'yyyy-MM-dd'),
          startTime: format(existingEvent.start, 'HH:mm'),
          endTime: format(existingEvent.end, 'HH:mm'),
          categoryId: existingEvent.categoryId,
          description: existingEvent.description || '',
          reminder: false,
        })
      } else if (initialDate) {
        form.reset({
          title: '',
          date: format(initialDate, 'yyyy-MM-dd'),
          startTime: format(new Date(), 'HH:mm'),
          endTime: format(
            new Date(new Date().setHours(new Date().getHours() + 1)),
            'HH:mm',
          ),
          categoryId: categories[0]?.id || '',
          description: '',
          reminder: false,
        })
      }
    }
  }, [isOpen, initialDate, existingEvent, form, categories])

  const onSubmit = (data: EventFormValues) => {
    setIsAnimating(true)

    const startDateTime = new Date(`${data.date}T${data.startTime}`)
    const endDateTime = new Date(`${data.date}T${data.endTime}`)

    if (endDateTime <= startDateTime) {
      form.setError('endTime', {
        message: 'O término deve ser depois do início',
      })
      setIsAnimating(false)
      return
    }

    const eventData = {
      title: data.title,
      description: data.description,
      start: startDateTime,
      end: endDateTime,
      categoryId: data.categoryId,
    }

    if (existingEvent) {
      updateEvent(existingEvent.id, eventData)
      toast.success('Evento atualizado com sucesso!')
    } else {
      addEvent(eventData)
      toast.success('Novo evento criado!')
    }

    setTimeout(() => {
      setIsAnimating(false)
      onClose()
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[24px] border-none shadow-2xl bg-[#FFF8F0] dark:bg-card p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary mb-2">
            {existingEvent ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Type className="absolute left-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="O que vamos planejar?"
                        className="pl-10 rounded-[16px] bg-white border-none shadow-sm h-12 text-lg"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative flex items-center">
                        <CalendarIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-9 rounded-[16px] bg-white border-none shadow-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="time"
                          className="rounded-[16px] bg-white border-none shadow-sm text-center px-1"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="time"
                          className="rounded-[16px] bg-white border-none shadow-sm text-center px-1"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground ml-1">
                    Categoria
                  </FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => field.onChange(cat.id)}
                        className={cn(
                          'cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2',
                          field.value === cat.id
                            ? 'scale-105 shadow-md'
                            : 'opacity-60 hover:opacity-100 border-transparent bg-white',
                        )}
                        style={{
                          backgroundColor:
                            field.value === cat.id ? cat.color : undefined,
                          color: field.value === cat.id ? '#FFF' : cat.color,
                          borderColor: cat.color,
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Adicione notas ou detalhes..."
                        className="pl-4 rounded-[16px] bg-white border-none shadow-sm resize-none min-h-[80px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-[16px] bg-white p-3 shadow-sm">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <FormLabel className="text-base cursor-pointer">
                      Lembrete
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className={cn(
                  'w-full rounded-pill h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300',
                  isAnimating && 'scale-95 opacity-80',
                )}
              >
                {existingEvent ? 'Salvar Alterações' : 'Criar Evento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
