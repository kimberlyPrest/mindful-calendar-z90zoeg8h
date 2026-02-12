import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCalendarStore from '@/stores/useCalendarStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
  eventId?: string
}

export function EventModal({
  isOpen,
  onClose,
  initialDate,
  eventId,
}: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent, events, categories } =
    useCalendarStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  useEffect(() => {
    if (isOpen) {
      if (eventId) {
        const event = events.find((e) => e.id === eventId)
        if (event) {
          setTitle(event.title)
          setDescription(event.description || '')
          setCategoryId(event.categoryId)
          setStartTime(format(new Date(event.start), 'HH:mm'))
          setEndTime(format(new Date(event.end), 'HH:mm'))
        }
      } else {
        setTitle('')
        setDescription('')
        setCategoryId(categories[0]?.id || '')
        setStartTime('09:00')
        setEndTime('10:00')
      }
    }
  }, [isOpen, eventId, events, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const baseDate = initialDate || new Date()
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const start = new Date(baseDate)
    start.setHours(startHour, startMinute, 0, 0)

    const end = new Date(baseDate)
    end.setHours(endHour, endMinute, 0, 0)

    if (eventId) {
      updateEvent(eventId, {
        title,
        description,
        categoryId,
        start,
        end,
      })
    } else {
      addEvent({
        title,
        description,
        categoryId,
        start,
        end,
        completed: false,
      })
    }
    onClose()
  }

  const handleDelete = () => {
    if (eventId) {
      deleteEvent(eventId)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{eventId ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
          <DialogDescription>
            {initialDate
              ? format(initialDate, "EEEE, d 'de' MMMM", { locale: ptBR })
              : 'Preencha os detalhes do evento'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião de equipe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start">Início</Label>
              <Input
                id="start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end">Fim</Label>
              <Input
                id="end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
            />
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            {eventId && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
