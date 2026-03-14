import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'

interface PaddingPropertiesProps {
    block: Block
}

export function PaddingProperties({ block }: PaddingPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const styles = block.styles || {}

    const paddingTop = styles.paddingTop || '0'
    const paddingBottom = styles.paddingBottom || '0'

    const handlePaddingChange = (key: string, value: string) => {
        updateBlock(block.id, {
            styles: { ...styles, [key]: value }
        })
    }

    return (
        <div className="space-y-4 pt-4 mt-6 border-t border-border">
            <h4 className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Spacing
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs text-text-muted">Top (px)</label>
                    <input
                        type="number"
                        value={paddingTop}
                        onChange={(e) => handlePaddingChange('paddingTop', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="0"
                        min="0"
                        max="120"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-text-muted">Bottom (px)</label>
                    <input
                        type="number"
                        value={paddingBottom}
                        onChange={(e) => handlePaddingChange('paddingBottom', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="0"
                        min="0"
                        max="120"
                    />
                </div>
            </div>
        </div>
    )
}
