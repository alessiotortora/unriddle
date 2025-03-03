'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Copy, Server } from 'lucide-react'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ApiAlertProps {
  title: string
  description: string
  variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin'
}

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
}

function ApiAlert({ title, description, variant }: ApiAlertProps) {


  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description)
    // toast({
    //   title: 'Copied!',
    //   description: 'The API key has been copied to your clipboard.'
    // })
  }

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-1 font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={() => onCopy(description)}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ApiAlert
