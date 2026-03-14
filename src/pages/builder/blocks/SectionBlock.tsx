import type { Block } from '@/types/blocks'

interface SectionBlockProps {
    block: Block
}

export function SectionBlock({ block }: SectionBlockProps) {
    const content = block.content || {}
    const label = content.label || 'Section Title'
    const showLabel = content.showLabel !== undefined ? content.showLabel : true

    return (
        <div className="w-full pt-6 pb-2 group">
            {showLabel && (
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="shrink-0 text-xs font-bold uppercase tracking-widest text-text-primary">
                        {label}
                    </h2>
                    <div className="flex-1 h-[1px] bg-border/60" />
                </div>
            )}
            {/* The actual layout wrapper logic for child blocks isn't fully supported in this version, so this serves primarily as a visual section divider and header */}
        </div>
    )
}
