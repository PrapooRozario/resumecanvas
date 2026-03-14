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
        <Dialog open={open}  onOpenChange={onOpenChange}>
            {/* Override the default max-w-lg from the simple dialog implementation */}
            <div className="fixed border-none inset-0 z-50 flex items-center justify-center p-4 py-8 pointer-events-none">
                <div className="relative w-fit max-h-[90vh] flex flex-col pointer-events-auto">
                    {/* Subtle glow behind the modal */}
                    <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
                    
                    <DialogContent className="relative flex flex-col p-0 overflow-hidden rounded-xl md:rounded-2xl border-none shadow-2xl bg-surface">
                        
                        {/* Browser Chrome Header */}
                        <div className="h-10 md:h-12 w-full border-b border-border flex items-center px-4 justify-between bg-surface-2 shrink-0">
                        {/* Traffic Lights */}
                        <div className="flex items-center gap-2 w-20">
                            
                        </div>

                   

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

                    {/* Scrollable Body with Neutral Gray Background */}
                    <div className="overflow-y-auto bg-canvas flex justify-center">
                        {/* We use a wrapper to constrain width just like the real export */}
                        <div>
                            <ResumeTemplate
                                blocks={blocks}
                                theme={previewTheme}
                                interactive={false}
                            />
                        </div>
                    </div>
                </DialogContent>
                </div>
            </div>
        </Dialog>
    )
}
