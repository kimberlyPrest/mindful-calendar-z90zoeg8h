import { useState } from 'react'
import useCalendarStore, { Category } from '@/stores/useCalendarStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Plus, BarChart3 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export default function CategoriesPage() {
  const { categories, events, addCategory, deleteCategory } = useCalendarStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#FF8C5F')

  // Calculate distribution
  const data = categories
    .map((cat) => ({
      name: cat.name,
      value: events.filter((e) => e.categoryId === cat.id).length,
      color: cat.color,
    }))
    .filter((d) => d.value > 0)

  const handleAdd = () => {
    if (newCategoryName) {
      addCategory({
        name: newCategoryName,
        color: newCategoryColor,
        type: 'Personal',
      })
      setNewCategoryName('')
      setIsAddOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Cores da Mente</h2>
      <p className="text-muted-foreground">
        Gerencie suas categorias e visualize como você gasta seu tempo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Section */}
        <Card className="rounded-[32px] border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Distribuição de Tempo
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Categoria
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].name}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Eventos
                                </span>
                                <span className="font-bold">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Sem dados suficientes
              </div>
            )}
          </CardContent>
        </Card>

        {/* List Section */}
        <Card className="rounded-[32px] border-none shadow-soft bg-white/60 dark:bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categorias</CardTitle>
            <Button
              onClick={() => setIsAddOpen(true)}
              size="sm"
              className="rounded-full bg-primary"
            >
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-[16px] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold">{cat.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Meditação, Leitura"
                className="rounded-[12px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  '#FF8C5F',
                  '#49A1FF',
                  '#7ED321',
                  '#F4A261',
                  '#E76F51',
                  '#2A9D8F',
                  '#E9C46A',
                ].map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${newCategoryColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} className="rounded-full">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
