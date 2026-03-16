import type { Block } from '@/types/blocks'
import { ArrowUpRight } from 'lucide-react'

interface ProjectCardBlockProps {
    block: Block
}

export function ProjectCardBlock({ block }: ProjectCardBlockProps) {
    const content = block.content || {}
    const title = content.title || 'Project Title'
    const description = content.description || 'A brief description of the project and what it accomplishes.'
    const url = content.url || ''
    const imageUrl = content.imageUrl || ''

    return (
        <div className="w-full flex gap-6 p-4 rounded-xl border border-border/60 bg-surface-2/30 hover:bg-surface transition-colors group">

            <div className="flex-1 space-y-2">
                <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                    {title || <span className="text-text-muted/40">Project Title</span>}
                </h3>

                <div 
                    className="text-[14px] text-text-secondary leading-relaxed w-full"
                    dangerouslySetInnerHTML={{ __html: description || '<p class="text-text-muted/40">Describe your project...</p>' }}
                />

                {url !== undefined && (
                    <div className="pt-1 flex items-center gap-2 text-[13px] font-medium text-text-muted">
                        <span>Link:</span>
                        <span className="font-mono">{url || <span className="text-text-muted/40">https://</span>}</span>
                        {url && <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                )}
            </div>

            {imageUrl && (
                <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 overflow-hidden rounded-lg bg-surface border border-border">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

        </div>
    )
}
