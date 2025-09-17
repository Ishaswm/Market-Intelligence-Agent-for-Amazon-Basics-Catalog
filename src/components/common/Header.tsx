import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type HeaderProps = {
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
  }
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="grid gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick}>
          <Download className="mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  )
}
