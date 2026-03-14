import type { Block } from '@/types/blocks'
import { User } from 'lucide-react'

interface PhotoBlockProps {
    block: Block
}

export function PhotoBlock({ block }: PhotoBlockProps) {
    const content = block.content || {}
    const url = content.url || ''
    const shape = content.shape || 'circle'
    const size = content.size || 100

    const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-md'

    return (
        <div className="w-full flex items-center justify-center py-4">
            {url ? (
                <img
                    src={url}
                    alt="Profile"
                    className={`object-cover bg-surface border border-border/50 shadow-sm ${radiusClass}`}
                    style={{ width: size, height: size }}
                />
            ) : (
                <div
                    className={`bg-surface-2 border border-dashed border-border flex items-center justify-center text-text-muted ${radiusClass}`}
                    style={{ width: size, height: size }}
                >
                    <User className="w-1/3 h-1/3 opacity-50" />
                </div>
            )}
        </div>
    )
}
