import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { Minus, MoreHorizontal } from 'lucide-react'

interface DividerPropertiesProps {
    block: Block
}

export function DividerProperties({ block }: DividerPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const style = content.style ?? 'solid'

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Line Style
                </label>
                <div className="flex bg-background border border-border rounded-md p-1">
                    <button
                        onClick={() => handleChange('style', 'solid')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${style === 'solid'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <Minus className="w-4 h-4" /> Solid
                    </button>
                    <button
                        onClick={() => handleChange('style', 'dashed')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${style === 'dashed'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <span className="tracking-widest font-mono font-bold">- -</span> Dashed
                    </button>
                    <button
                        onClick={() => handleChange('style', 'dotted')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${style === 'dotted'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <MoreHorizontal className="w-4 h-4" /> Dotted
                    </button>
                </div>
            </div>
        </div>
    )
}
