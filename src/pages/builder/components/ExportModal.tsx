import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { useAuthStore } from '@/store/useAuthStore'


interface ExportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onExport: (filename: string) => Promise<void>
    isExporting: boolean
}

export function ExportModal({ open, onOpenChange, onExport, isExporting }: ExportModalProps) {
    const { user } = useAuthStore()
    const [filename, setFilename] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Format default filename: either from last export or generic "[username]-resume"
    // For now we'll just prepopulate using user name or 'my-resume'
    useEffect(() => {
        if (open) {
            const defaultName = user?.user_metadata?.username
                ? `${user.user_metadata.username}-resume`
                : 'my-resume'
            // We should ideally read resumes.meta.lastExportName here if available,
            // but for simplicity we rely on the parent logic if we pass it down, 
            // or just set a good default.
            setFilename(defaultName)
            setError(null)
        }
    }, [open, user])

    const sanitizeFilename = (name: string) => {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
    }

    const handleDownload = async () => {
        const sanitized = sanitizeFilename(filename)
        if (!sanitized) {
            setError('Filename is invalid')
            return
        }
        
        // Let parent handle the actual export
        await onExport(sanitized)
    }

    return (
        <Dialog open={open} onOpenChange={isExporting ? undefined : onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Export Resume</DialogTitle>
                    <DialogDescription>
                        Rename your file before downloading.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => {
                                setFilename(e.target.value)
                                setError(null)
                            }}
                            onFocus={(e) => e.target.select()}
                            autoFocus
                            disabled={isExporting}
                            className={`w-full h-10 px-3 py-2 bg-surface border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent ${error ? 'border-red-500' : 'border-border'}`}
                            placeholder="my-resume"
                        />
                        <span className="absolute right-3 text-sm text-text-muted pointer-events-none select-none">
                            .pdf
                        </span>
                    </div>
                    {error && (
                        <p className="text-red-500 flex text-xs mt-1.5">{error}</p>
                    )}
                    <p className="text-xs text-text-muted mt-2">Only letters, numbers, - and _ allowed</p>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isExporting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDownload} 
                        disabled={isExporting || sanitizeFilename(filename).length === 0}
                    >
                        {isExporting ? 'Exporting...' : 'Download PDF'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
