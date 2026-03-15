import { useEffect, useRef } from 'react'
import { useBuilderStore } from '@/store/useBuilderStore'
import { useUpdateBlock } from '@/hooks/mutations/useUpdateBlock'
import { useUpdateResume } from '@/hooks/mutations/useUpdateResume'

export function BuilderAutoSave({ resumeId }: { resumeId: string }) {
    const { isDirty, title, theme, blocks, setClean, setSaving } = useBuilderStore()
    
    const updateResumeMut = useUpdateResume(resumeId)
    const updateBlockMut = useUpdateBlock(resumeId)
    
    const isPending = updateResumeMut.isPending || updateBlockMut.isPending

    useEffect(() => {
        setSaving(isPending)
    }, [isPending, setSaving])

    const prevTitle = useRef(title)
    const prevTheme = useRef(theme)
    const prevBlocks = useRef(blocks)

    useEffect(() => {
        if (!isDirty) {
            prevTitle.current = title;
            prevTheme.current = theme;
            prevBlocks.current = blocks;
            return;
        }

        const timer = setTimeout(() => {
            if (title !== prevTitle.current || theme !== prevTheme.current) {
                updateResumeMut.mutate({ title, theme })
            }

            // Check if any block's content or styles changed (while retaining same id/order)
            if (blocks.length === prevBlocks.current.length) {
                for (let i = 0; i < blocks.length; i++) {
                    const block = blocks[i]
                    const prev = prevBlocks.current[i]
                    if (prev && prev.id === block.id && (prev.content !== block.content || prev.styles !== block.styles)) {
                        updateBlockMut.mutate({ id: block.id, updates: { content: block.content, styles: block.styles } })
                    }
                }
            }

            prevTitle.current = title;
            prevTheme.current = theme;
            prevBlocks.current = blocks;

            // If a mutation was fired or if it was just a structural change (handled elsewhere),
            // reset the dirty state so it says "Saved"
            setClean();
            
        }, 1500)

        return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDirty, title, theme, blocks, resumeId, setClean])

    return null
}
