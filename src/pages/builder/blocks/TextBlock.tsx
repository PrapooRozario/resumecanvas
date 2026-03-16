import type { Block } from '@/types/blocks'

interface TextBlockProps {
    block: Block
}

export function TextBlock({ block }: TextBlockProps) {
    const content = block.content || {}
    const html = content.html || '<p class="text-text-muted/40">Add your bio or description here...</p>'

    return (
        <div 
            className="text-text-primary prose-p:leading-[1.7] prose-a:text-accent prose-a:no-underline hover:prose-a:underline font-sans w-full"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
