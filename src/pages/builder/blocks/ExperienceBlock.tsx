import type { Block } from '@/types/blocks'
import { ArrowUpRight } from 'lucide-react'

interface ExperienceBlockProps {
    block: Block
}

export function ExperienceBlock({ block }: ExperienceBlockProps) {
    const content = block.content || {}
    const company = content.company || 'Company Name'
    const role = content.role || 'Job Title'
    const startDate = content.startDate || '2020'
    const endDate = content.endDate || 'Present'
    const location = content.location || ''
    const description = content.description || ''
    const url = content.url || ''

    return (
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-8 group">
            {/* Left Column: Dates */}
            <div className="sm:w-32 shrink-0 pt-0.5">
                <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
                    {startDate} — {endDate}
                </p>
            </div>

            {/* Right Column: Details */}
            <div className="flex-1 space-y-2">
                <div>
                    <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                        {role} at {company}
                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </h3>
                    {location && (
                        <p className="text-sm text-text-muted mt-0.5">{location}</p>
                    )}
                </div>

                {description && (
                    <div
                        className="prose prose-sm max-w-none text-text-secondary prose-p:leading-[1.6] prose-a:text-accent font-sans"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}
            </div>
        </div>
    )
}
