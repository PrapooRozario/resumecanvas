import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // Check if the child is a DropdownMenuTrigger to pass specific props
                    // This helps avoid passing `isOpen` and `setIsOpen` to components that don't expect them,
                    // which can lead to type errors in a strongly typed environment.
                    if ((child.type as any).displayName === 'DropdownMenuTrigger') {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            isOpen,
                            setIsOpen,
                            className: cn("bg-transparent outline-none", (child.props as any).className)
                        })
                    }
                    // For other children (like DropdownMenuContent), pass only relevant props if needed,
                    // or just clone without modification if they handle their own props.
                    // In this specific case, DropdownMenuContent already receives isOpen as a direct prop from DropdownMenu.
                    // If the intention was to pass isOpen/setIsOpen to ALL children, the original approach was fine,
                    // but the instruction implies a type error related to props.
                    // The className modification seems specific to the trigger.
                    return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
                }
                return child
            })}
        </div>
    )
}

export function DropdownMenuTrigger({ children, asChild, isOpen, setIsOpen, className }: any) {
    const toggle = () => setIsOpen(!isOpen)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: toggle,
            className: cn((children as React.ReactElement<any>).props.className, className)
        })
    }

    return (
        <button onClick={toggle} className={className}>
            {children}
        </button>
    )
}

export function DropdownMenuContent({ children, isOpen, align = 'right', className }: any) {
    if (!isOpen) return null

    return (
        <div className={cn(
            "absolute z-50 mt-2 w-56 rounded-md bg-surface border border-border shadow-lg py-1",
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            className
        )}>
            {children}
        </div>
    )
}

export function DropdownMenuItem({ children, onClick, className }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left block px-4 py-2 text-sm text-text-primary hover:bg-surface-2 transition-colors",
                className
            )}
        >
            {children}
        </button>
    )
}

export function DropdownMenuSeparator() {
    return <div className="h-[1px] w-full bg-border my-1" />
}
