import { useState } from 'react'
import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { X, List, LayoutGrid } from 'lucide-react'

interface SkillsPropertiesProps {
    block: Block
}

export function SkillsProperties({ block }: SkillsPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const skills: string[] = content.skills ?? []
    const layout = content.layout ?? 'tags'

    const [inputValue, setInputValue] = useState('')

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault()
            // Prevent duplicates
            if (!skills.includes(inputValue.trim())) {
                handleChange('skills', [...skills, inputValue.trim()])
            }
            setInputValue('')
        } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
            // Remove last skill on backspace if input is empty
            e.preventDefault()
            const newSkills = [...skills]
            newSkills.pop()
            handleChange('skills', newSkills)
        }
    }

    const removeSkill = (indexToRemove: number) => {
        handleChange('skills', skills.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="space-y-6">

            <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Skills
                </label>

                <div className="min-h-[40px] p-1.5 bg-background border border-border rounded-md text-sm focus-within:ring-1 focus-within:ring-accent transition-all flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 pl-2 pr-1 h-6 text-xs font-medium bg-surface text-text-primary border border-border rounded"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="p-0.5 text-text-muted hover:text-destructive rounded-sm transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 min-w-[80px] h-6 px-1.5 bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-muted/50"
                        placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add skill..."}
                    />
                </div>
                <p className="text-[11px] text-text-muted pt-1">Press <kbd className="font-mono bg-surface border border-border rounded px-1 text-[10px]">Enter</kbd> to add a skill</p>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Layout Style
                </label>
                <div className="flex bg-background border border-border rounded-md p-1">
                    <button
                        onClick={() => handleChange('layout', 'tags')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${layout === 'tags'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Tags
                    </button>
                    <button
                        onClick={() => handleChange('layout', 'list')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${layout === 'list'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <List className="w-4 h-4" /> List
                    </button>
                </div>
            </div>

        </div>
    )
}
