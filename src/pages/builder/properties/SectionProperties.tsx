import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'

interface SectionPropertiesProps {
    block: Block
}

export function SectionProperties({ block }: SectionPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const label = content.label ?? 'Section Title'
    const showLabel = content.showLabel !== undefined ? content.showLabel : true

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between pb-2 border-b border-border">
                <label className="text-sm font-medium text-text-primary">
                    Show Section Label
                </label>
                <button
                    onClick={() => handleChange('showLabel', !showLabel)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${showLabel ? 'bg-accent' : 'bg-surface-2'
                        }`}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${showLabel ? 'translate-x-[7px]' : '-translate-x-[7px]'
                            }`}
                    />
                </button>
            </div>

            {showLabel && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Label Text</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="e.g. WORK EXPERIENCE"
                    />
                </div>
            )}

        </div>
    )
}
