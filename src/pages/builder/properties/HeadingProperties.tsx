import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { AlignLeft, AlignCenter } from 'lucide-react'

interface HeadingPropertiesProps {
    block: Block
}

export function HeadingProperties({ block }: HeadingPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const text = content.text ?? 'Your Name'
    const level = content.level ?? 1
    const align = content.align ?? 'left'

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Text
                </label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="Enter heading text..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Level
                </label>
                <div className="flex bg-background border border-border rounded-md p-1">
                    {[1, 2, 3].map((l) => (
                        <button
                            key={l}
                            onClick={() => handleChange('level', l)}
                            className={`flex-1 flex items-center justify-center h-7 text-xs font-medium rounded-sm transition-all ${level === l
                                ? 'bg-surface shadow-sm text-text-primary'
                                : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                                }`}
                        >
                            H{l}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Alignment
                </label>
                <div className="flex bg-background border border-border rounded-md p-1">
                    <button
                        onClick={() => handleChange('align', 'left')}
                        className={`flex-1 flex items-center justify-center h-7 text-xs font-medium rounded-sm transition-all ${align === 'left'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleChange('align', 'center')}
                        className={`flex-1 flex items-center justify-center h-7 text-xs font-medium rounded-sm transition-all ${align === 'center'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
