import type { Block } from '@/types/blocks'
import { ArrowUpRight } from 'lucide-react'

interface SocialLink {
    platform: string
    url: string
}

interface SocialLinksBlockProps {
    block: Block
}

export function SocialLinksBlock({ block }: SocialLinksBlockProps) {
    const content = block.content || {}
    const links: SocialLink[] = content.links || [
        { platform: 'Twitter', url: 'https://twitter.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' }
    ]

    if (!links || links.length === 0) {
        return <div className="text-sm text-text-muted italic py-1">Add links in the properties panel...</div>
    }

    return (
        <div className="w-full space-y-2">
            {links.map((link, index) => {
                return (
                    <div key={index} className="flex flex-col sm:flex-row gap-1 sm:gap-8 group">
                        <div className="sm:w-32 shrink-0 sm:pt-0.5">
                            <div className="text-[14px] text-text-primary capitalize flex items-center h-full">
                                {link.platform || <span className="text-text-muted/40">Platform</span>}
                            </div>
                        </div>
                        <div className="flex-1 flex items-center h-full">
                            <div className="inline-flex items-center gap-1.5 text-[14px] text-text-muted hover:text-text-primary transition-colors group-hover:text-text-primary w-fit relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-text-muted/30 hover:after:bg-text-primary">
                                {link.url || <span className="text-text-muted/40">https://</span>}
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
