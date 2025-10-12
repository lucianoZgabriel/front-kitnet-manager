import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils/cn'

interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
  className?: string
}

export function ErrorMessage({ title = 'Erro', message, retry, className }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={cn('', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="shrink-0">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function ErrorPage({
  title = 'Erro ao carregar',
  message = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorMessage title={title} message={message} retry={retry} />
      </div>
    </div>
  )
}
