import type { Block } from '@/types/blocks'

interface EducationBlockProps {
    block: Block
}

export function EducationBlock({ block }: EducationBlockProps) {
    const content = block.content || {}
    const institution = content.institution || 'Institution Name'
    const degree = content.degree || 'Degree or Field of Study'
    const startDate = content.startDate || '2016'
    const endDate = content.endDate || '2020'
    const location = content.location || ''

    return (
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-8 group">
            {/* Left Column: Dates */}
            <div className="sm:w-32 shrink-0 pt-0.5">
                <p className="font-mono text-xs text-text-muted uppercase tracking-wider flex items-center gap-1">
                    {startDate || <span className="text-text-muted/40">Start</span>}
                    <span>—</span>
                    {endDate || <span className="text-text-muted/40">End</span>}
                </p>
            </div>

            {/* Right Column: Details */}
            <div className="flex-1 space-y-0.5">
                <h3 className="text-base font-semibold text-text-primary flex items-center gap-1.5 flex-wrap">
                    {degree || <span className="text-text-muted/40">Degree</span>}
                    <span className="text-text-muted/60 font-normal">at</span>
                    <span className="text-accent">{institution || <span className="text-text-muted/40">Institution</span>}</span>
                </h3>
                <div className="text-sm text-text-muted">
                    {location || <span className="text-text-muted/40">Location</span>}
                </div>
            </div>
        </div>
    )
}
