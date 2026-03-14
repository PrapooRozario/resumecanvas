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
                <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
                    {startDate} — {endDate}
                </p>
            </div>

            {/* Right Column: Details */}
            <div className="flex-1 space-y-0.5">
                <h3 className="text-base font-semibold text-text-primary">
                    {degree} at {institution}
                </h3>
                {location && (
                    <p className="text-sm text-text-muted">{location}</p>
                )}
            </div>
        </div>
    )
}
