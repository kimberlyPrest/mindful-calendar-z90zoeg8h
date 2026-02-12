import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Bell, Moon, Volume2, Shield } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-primary">Configurações</h2>

      <Card className="rounded-[32px] border-none shadow-soft overflow-hidden">
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Modo Escuro</p>
                <p className="text-sm text-muted-foreground">
                  Alternar tema da interface
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full text-orange-600 dark:text-orange-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Notificações</p>
                <p className="text-sm text-muted-foreground">
                  Lembretes de eventos
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Sons de Ambiente</p>
                <p className="text-sm text-muted-foreground">
                  Reproduzir sons suaves ao completar tarefas
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-none shadow-soft overflow-hidden">
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Privacidade de Dados</p>
                <p className="text-sm text-muted-foreground">
                  Seus dados são armazenados localmente
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full rounded-full h-12 text-lg"
          >
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
