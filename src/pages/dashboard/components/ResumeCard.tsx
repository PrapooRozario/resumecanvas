import { Pencil, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResumeCardProps {
    resume: {
        id: string;
        title: string;
        updated_at: string;
    };
    onEdit: (id: string) => void;
    onExport: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onEdit, onExport, onDelete }: ResumeCardProps) {
    // Simple "Days ago" calc
    const daysAgo = Math.floor((new Date().getTime() - new Date(resume.updated_at).getTime()) / (1000 * 3600 * 24))
    const updatedText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`

    return (
        <div className="group relative flex flex-col bg-surface-2 border border-border rounded-lg overflow-hidden transition-all hover:border-accent/50 focus-within:ring-2 focus-within:ring-accent">
            {/* Top Thumbnail Area */}
            <div
                className="aspect-[1/1.4] bg-surface flex flex-col items-center justify-center p-6 border-b border-border cursor-pointer"
                onClick={() => onEdit(resume.id)}
                role="button"
                tabIndex={0}
            >
                {/* Placeholder for actual resume preview layout */}
                <div className="w-full h-full bg-background/50 rounded shadow-sm border border-border flex items-center justify-center relative overflow-hidden">
                    <h3 className="font-serif text-lg text-text-primary/40 truncate w-[80%] text-center">
                        {resume.title || 'Untitled Resume'}
                    </h3>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <Button variant="ghost" className="w-32 bg-surface hover:bg-surface-2" onClick={(e) => { e.stopPropagation(); onEdit(resume.id); }}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="ghost" className="w-32 bg-surface hover:bg-surface-2" onClick={(e) => { e.stopPropagation(); onExport(resume.id); }}>
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                        <Button variant="ghost" className="w-32 bg-destructive/10 text-destructive hover:bg-surface-2 hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Metadata Area */}
            <div className="p-4 flex items-center justify-between bg-surface-2">
                <div className="flex-1 min-w-0 pr-4 cursor-pointer" onClick={() => onEdit(resume.id)}>
                    <h4 className="text-sm font-medium text-text-primary truncate">{resume.title || 'Untitled Resume'}</h4>
                    <p className="text-xs text-text-muted mt-0.5">Last updated {updatedText}</p>
                </div>
            </div>
        </div>
    )
}
