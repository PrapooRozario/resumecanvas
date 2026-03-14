import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { useBuilderStore } from '@/store/useBuilderStore'
import { ResumeTemplate } from '@/components/resume/ResumeTemplate'

interface PreviewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PreviewModal({ open, onOpenChange }: PreviewModalProps) {
    const { blocks, theme: globalTheme } = useBuilderStore()
    const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>(globalTheme)

    // Sync preview theme when global theme changes only when it opens
    React.useEffect(() => {
        if (open) {
            setPreviewTheme(globalTheme)
        }
    }, [open, globalTheme])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Custom overlay + positioner — bypasses DialogContent's default max-w-lg */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 pointer-events-none">
                {/* Fixed A4 width: 794px = 210mm at 96 dpi */}
                <div className="relative flex flex-col pointer-events-auto" style={{ width: '794px', maxWidth: '100%', maxHeight: '90dvh' }}>
                    {/* Subtle glow behind the modal */}
                    <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

                    <DialogContent
                        className="relative flex flex-col p-0 overflow-hidden rounded-xl md:rounded-2xl border-none shadow-2xl bg-surface"
                        style={{ width: '794px', maxWidth: '100%' }}
                    >
                        {/* Browser Chrome Header */}
                        <div className="h-10 md:h-12 w-full border-b border-border flex items-center px-4 justify-between bg-surface-2 shrink-0">
                            {/* Traffic Lights placeholder */}
                            <div className="flex items-center gap-2 w-20" />

                            {/* Right Tools */}
                            <div className="flex items-center justify-end gap-2 w-20">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-sm text-text-muted hover:text-text-primary mb-[1px]"
                                    onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
                                    title="Toggle Preview Theme"
                                >
                                    {previewTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                                </Button>
                            </div>
                        </div>

                        {/* Scrollable Resume Body */}
                        <div className="bg-canvas flex overflow-y-scroll justify-center flex-1 min-h-0">
                            <ResumeTemplate
                                blocks={blocks}
                                theme={previewTheme}
                                interactive={false}
                            />
                        </div>
                    </DialogContent>
                </div>
            </div>
        </Dialog>
    )
}
