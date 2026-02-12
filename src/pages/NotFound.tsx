import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4 text-center">
      <img
        src="https://img.usecurling.com/p/400/400?q=lost%20illustration&color=orange"
        alt="404"
        className="w-64 h-64 mb-8 opacity-80"
      />
      <h1 className="text-4xl font-bold text-primary mb-2">
        Ops! Página não encontrada
      </h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Parece que nos perdemos no caminho. Vamos voltar ao centro.
      </p>
      <Link to="/">
        <Button className="rounded-full px-8 py-6 text-lg">
          Voltar ao Início
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
