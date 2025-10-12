import { cn } from '@/src/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={cn(
          'border-primary animate-spin rounded-full border-t-transparent',
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}

export function LoadingPage({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
