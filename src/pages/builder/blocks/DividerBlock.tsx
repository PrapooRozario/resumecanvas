import type { Block } from '@/types/blocks'

interface DividerBlockProps {
    block: Block
}

export function DividerBlock({ block }: DividerBlockProps) {
    const content = block.content || {}
    const style = content.style || 'solid'

    const styleMap = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted'
    }

    const borderClass = styleMap[style as keyof typeof styleMap] || 'border-solid'

    return (
        <div className="w-full py-4 flex items-center">
            <div className={`w-full border-t border-border/80 ${borderClass}`} />
        </div>
    )
}
