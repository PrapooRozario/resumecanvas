import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'

interface EducationPropertiesProps {
    block: Block
}

export function EducationProperties({ block }: EducationPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const institution = content.institution ?? ''
    const degree = content.degree ?? ''
    const startDate = content.startDate ?? ''
    const endDate = content.endDate ?? ''
    const location = content.location ?? ''

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    return (
        <div className="space-y-4">

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Institution</label>
                <input
                    type="text"
                    value={institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. University of California"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Degree</label>
                <input
                    type="text"
                    value={degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. B.S. Computer Science"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Start Date</label>
                    <input
                        type="text"
                        value={startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="e.g. 2016"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">End Date</label>
                    <input
                        type="text"
                        value={endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="e.g. 2020"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Berkeley, CA"
                />
            </div>
        </div>
    )
}
