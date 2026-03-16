import type { Block } from '@/types/blocks'

interface HeadingBlockProps {
    block: Block
}

export function HeadingBlock({ block }: HeadingBlockProps) {
    const content = block.content || {}
    const text = content.text || 'Your Name'
    const level = content.level || 1
    const align = content.align || 'left'

    const commonClasses = `w-full bg-transparent focus:outline-none transition-colors`
    const alignClasses = align === 'center' ? 'text-center' : 'text-left'

    if (level === 1) {
        return (
            <h1 className={`font-serif text-[32px] leading-tight text-text-primary ${commonClasses} ${alignClasses}`}>
                {text || <span className="text-text-muted/40">Heading</span>}
            </h1>
        )
    }

    if (level === 2) {
        return (
            <h2 className={`font-sans font-semibold text-[20px] leading-snug text-text-primary ${commonClasses} ${alignClasses}`}>
                {text || <span className="text-text-muted/40">Subheading</span>}
            </h2>
        )
    }

    return (
        <h3 className={`font-sans font-semibold text-[16px] leading-normal text-text-primary ${commonClasses} ${alignClasses}`}>
            {text || <span className="text-text-muted/40">Small Heading</span>}
        </h3>
    )
}
