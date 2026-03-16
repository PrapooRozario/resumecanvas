import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'

interface ExperiencePropertiesProps {
    block: Block
}

export function ExperienceProperties({ block }: ExperiencePropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const company = content.company ?? ''
    const role = content.role ?? ''
    const startDate = content.startDate ?? ''
    const endDate = content.endDate ?? ''
    const location = content.location ?? ''
    const url = content.url ?? ''
    const description = content.description ?? ''

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    return (
        <div className="space-y-4">

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Company</label>
                <input
                    type="text"
                    value={company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Acme Corp"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Role</label>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Senior Product Designer"
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
                        placeholder="e.g. 2019"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">End Date</label>
                    <input
                        type="text"
                        value={endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="e.g. 2021 or Present"
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
                    placeholder="e.g. San Francisco, CA"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Company URL</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. https://acme.com"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Description (HTML allowed)</label>
                <textarea
                    value={description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-[100px] w-full p-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-y"
                    placeholder="Enter text or HTML..."
                />
            </div>
        </div>
    )
}
