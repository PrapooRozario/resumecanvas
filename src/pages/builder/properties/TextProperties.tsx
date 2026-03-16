import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'

interface TextPropertiesProps {
    block: Block
}

// Strip HTML tags to get plain text for display in the textarea
function htmlToPlainText(html: string): string {
    return html
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')    // remove any remaining tags
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .trim()
}

// Convert plain text back to simple paragraph HTML
function plainTextToHtml(text: string): string {
    if (!text.trim()) return ''
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${line}</p>`)
        .join('')
}

export function TextProperties({ block }: TextPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}
    const html = content.html ?? ''
    const plainText = htmlToPlainText(html)

    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Content
            </label>
            <div className="flex flex-col gap-2">
                <textarea
                    value={plainText}
                    onChange={(e) => {
                        const newHtml = plainTextToHtml(e.target.value)
                        updateBlock(block.id, {
                            content: { ...content, html: newHtml }
                        })
                    }}
                    className="min-h-[150px] w-full p-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-y"
                    placeholder="Type your text here..."
                />
            </div>
        </div>
    )
}
