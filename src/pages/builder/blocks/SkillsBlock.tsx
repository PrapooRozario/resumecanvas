import type { Block } from '@/types/blocks'

interface SkillsBlockProps {
    block: Block
}

export function SkillsBlock({ block }: SkillsBlockProps) {
    const content = block.content || {}
    const skills: string[] = content.skills || ['JavaScript', 'React', 'TypeScript']
    const layout = content.layout || 'tags'

    if (!skills || skills.length === 0) {
        return <div className="text-sm text-text-muted italic py-1">Add skills in the properties panel...</div>
    }

    if (layout === 'list') {
        return (
            <div className="w-full text-base text-text-primary leading-relaxed">
                {skills.join(', ')}
            </div>
        )
    }

    return (
        <div className="w-full flex flex-wrap gap-2 items-center">
            {skills.map((skill, index) => (
                <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 text-[13px] font-medium text-text-primary bg-surface border border-border rounded-md transition-colors"
                >
                    {skill || <span className="text-text-muted/40">Skill</span>}
                </span>
            ))}
        </div>
    )
}
