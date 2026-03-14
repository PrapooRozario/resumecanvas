import React from 'react'
import { cn } from '@/lib/utils'

export function Avatar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
            {children}
        </div>
    )
}

export function AvatarImage({ src, alt, className }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src={src} alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} />
    )
}

export function AvatarFallback({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-surface-2 text-text-primary text-sm font-medium", className)}>
            {children}
        </div>
    )
}
