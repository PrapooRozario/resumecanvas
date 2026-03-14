import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { Plus, GripVertical, Trash2 } from 'lucide-react'

interface SocialLink {
    platform: string
    url: string
}

interface SocialLinksPropertiesProps {
    block: Block
}

export function SocialLinksProperties({ block }: SocialLinksPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    // Default to a couple empty ones if nothing exists
    const links: SocialLink[] = content.links ?? []

    const handleChange = (newLinks: SocialLink[]) => {
        updateBlock(block.id, {
            content: { ...content, links: newLinks }
        })
    }

    const addLink = () => {
        handleChange([...links, { platform: '', url: '' }])
    }

    const removeLink = (index: number) => {
        const newLinks = [...links]
        newLinks.splice(index, 1)
        handleChange(newLinks)
    }

    const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
        const newLinks = [...links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        handleChange(newLinks)
    }

    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Links
                </label>
                <button
                    onClick={addLink}
                    className="flex items-center justify-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 transition-colors px-1.5 py-0.5 rounded hover:bg-accent/10"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
            </div>

            <div className="space-y-2.5">
                {links.length === 0 && (
                    <div className="text-[13px] text-text-muted italic py-4 text-center border border-dashed border-border rounded-lg bg-surface-2">
                        No links added yet.
                    </div>
                )}

                {links.map((link, index) => (
                    <div key={index} className="flex items-start gap-2 p-2.5 bg-surface-2 border border-border rounded-lg group">
                        <div className="pt-2 text-text-muted/50 cursor-grab hover:text-text-primary transition-colors">
                            <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                value={link.platform}
                                onChange={(e) => updateLink(index, 'platform', e.target.value)}
                                className="w-full h-7 px-2 bg-background border border-border rounded text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
                                placeholder="Platform (e.g. GitHub)"
                            />
                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                className="w-full h-7 px-2 bg-background border border-border rounded text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
                                placeholder="URL (e.g. https://github.com/...)"
                            />
                        </div>

                        <button
                            onClick={() => removeLink(index)}
                            className="p-1.5 text-text-muted hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove link"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

        </div>
    )
}
