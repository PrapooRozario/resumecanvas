import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sun, Moon, Download, Loader2, CheckCircle2 } from 'lucide-react'
import { useBuilderStore } from '@/store/useBuilderStore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { PreviewModal } from './PreviewModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { supabase } from '@/lib/supabase'
import { ExportModal } from './ExportModal'

export function TopToolbar() {
    const { resumeId, title, setTitle, theme, setTheme, isDirty, isSaving, lastSaved, blocks, selectBlock } = useBuilderStore()
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [tempTitle, setTempTitle] = useState(title)

    const [previewOpen, setPreviewOpen] = useState(false)

    const [isExporting, setIsExporting] = useState(false)
    const [exportModalOpen, setExportModalOpen] = useState(false)

    useEffect(() => {
        setTempTitle(title)
    }, [title])

    const handleTitleSubmit = () => {
        setIsEditingTitle(false)
        if (tempTitle.trim() !== title) {
            setTitle(tempTitle.trim() || 'Untitled Resume')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleTitleSubmit()
        if (e.key === 'Escape') {
            setIsEditingTitle(false)
            setTempTitle(title)
        }
    }

    const handleExport = async (sanitizedName: string) => {
        const element = document.getElementById('resume-template-export')
        if (!element) {
            toast.error("Export failed: Could not find resume content.")
            return
        }

        setIsExporting(true)
        try {
            const computedBg = window.getComputedStyle(element).getPropertyValue('--resume-bg').trim()
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: computedBg,
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`${sanitizedName}.pdf`)

            if (resumeId) {
                const { data: resumeData } = await supabase.from('resumes').select('meta').eq('id', resumeId).single()
                const existingMeta = resumeData?.meta || {}
                await supabase.from('resumes').update({ meta: { ...existingMeta, lastExportName: sanitizedName } }).eq('id', resumeId)
            }

            toast.success(`Saved as ${sanitizedName}.pdf`)
            setExportModalOpen(false)
        } catch (error) {
            console.error('PDF export error:', error)
            toast.error("Export failed. Please try again.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <>
            <div className="h-12 w-full bg-surface border-b border-border flex items-center justify-between px-4 z-40 shrink-0" onClick={() => selectBlock(null)}>

                {/* Left section: Nav & Title */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" asChild>
                        <Link to="/dashboard">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>

                    {isEditingTitle ? (
                        <input
                            title="Resume Title"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={handleTitleSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="px-2 py-1 bg-surface-2 border border-accent/50 rounded-md text-sm font-medium focus:outline-none w-64 max-w-full"
                        />
                    ) : (
                        <h2
                            className="text-sm font-medium truncate cursor-text hover:bg-surface-2 px-2 py-1 rounded-md transition-colors w-64 max-w-full"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {title}
                        </h2>
                    )}
                </div>

    

                {/* Right section: Settings & Export */}
                <div className="flex items-center gap-3 flex-1 justify-end">

                    <div className="text-xs text-text-muted mr-2 hidden sm:flex items-center gap-1.5">
                        {isDirty && !isSaving && (
                            <><span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Unsaved changes</>
                        )}
                        {isSaving && (
                            <><Loader2 className="w-3 h-3 animate-spin text-text-secondary" /> Saving...</>
                        )}
                        {!isDirty && !isSaving && lastSaved && (
                            <><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Saved</>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>

                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {/* Put the disabled cursor on the wrapper so it actually shows up */}
                                <span 
                                    className={`hidden sm:inline-flex rounded-md ${(blocks.length === 0) ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    onClick={(e) => {
                                        if (blocks.length === 0) { e.preventDefault(); e.stopPropagation(); return; }
                                        setPreviewOpen(true)
                                    }}
                                >
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 text-xs pointer-events-none"
                                        disabled={blocks.length === 0}
                                    >
                                        Preview
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {blocks.length === 0 && (
                                <TooltipContent className='border-border'>
                                    <p>Add blocks to your resume first</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>



                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span 
                                    className={`hidden sm:inline-flex rounded-md ${blocks.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    onClick={(e) => {
                                        if (blocks.length === 0) { e.preventDefault(); e.stopPropagation(); return; }
                                        setExportModalOpen(true)
                                    }}
                                >
                                    <Button 
                                        size="sm" 
                                        className="h-8 text-xs pointer-events-none" 
                                    >
                                        <Download className="w-3.5 h-3.5 mr-2" />
                                        Export PDF
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='border-border'>
                                {blocks.length === 0 ? (
                                    <p>Add blocks to your resume first</p>
                                ) : (
                                    <p>Export as PDF</p>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

            </div>
            
            {/* Nav Modals */}
            <PreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
            <ExportModal 
                open={exportModalOpen} 
                onOpenChange={setExportModalOpen} 
                onExport={handleExport} 
                isExporting={isExporting} 
            />
        </>
    )
}
