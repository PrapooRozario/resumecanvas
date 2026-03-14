import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Block } from '@/types/blocks'
import { toast } from 'sonner'

interface BuilderState {
    resumeId: string | null
    title: string
    blocks: Block[]
    selectedBlockId: string | null
    theme: 'light' | 'dark'
    isDirty: boolean
    isSaving: boolean
    lastSaved: Date | null

    // Actions
    setResume: (id: string, title: string, blocks: Block[]) => void
    setTitle: (title: string) => void
    addBlock: (block: Block, index?: number) => void
    removeBlock: (id: string) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    reorderBlocks: (startIndex: number, endIndex: number) => void
    selectBlock: (id: string | null) => void
    setTheme: (theme: 'light' | 'dark') => void

    // Internal save setter
    setSaving: (isSaving: boolean) => void
    setClean: () => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
    resumeId: null,
    title: 'Untitled Resume',
    blocks: [],
    selectedBlockId: null,
    theme: 'light',
    isDirty: false,
    isSaving: false,
    lastSaved: null,

    setResume: (id, title, blocks) => set({ resumeId: id, title, blocks, isDirty: false }),
    setTitle: (title) => set({ title, isDirty: true }),

    addBlock: (block, index) => set((state) => {
        const validTypes = ['heading', 'text', 'photo', 'experience', 'education', 'skills', 'project_card', 'social_links', 'divider', 'section'];
        if (!validTypes.includes(block.type)) {
            console.warn(`Attempted to add invalid block type: ${block.type}`);
            return state;
        }

        const newBlocks = [...state.blocks]
        if (typeof index === 'number') {
            newBlocks.splice(index, 0, block)
        } else {
            newBlocks.push(block)
        }
        const reordered = newBlocks.map((b, i) => ({ ...b, order_index: i }))
        return { blocks: reordered, isDirty: true }
    }),

    removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        isDirty: true
    })),

    updateBlock: (id, updates) => set((state) => ({
        blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b),
        isDirty: true
    })),

    reorderBlocks: (startIndex, endIndex) => set((state) => {
        const newBlocks = Array.from(state.blocks)
        const [removed] = newBlocks.splice(startIndex, 1)
        newBlocks.splice(endIndex, 0, removed)

        // Update order_indexes
        const reordered = newBlocks.map((b, i) => ({ ...b, order_index: i }))
        return { blocks: reordered, isDirty: true }
    }),

    selectBlock: (id) => set({ selectedBlockId: id }),
    setTheme: (theme) => set({ theme, isDirty: true }),

    setSaving: (isSaving) => set({ isSaving }),
    setClean: () => set({ isDirty: false, isSaving: false, lastSaved: new Date() })
}))

// Auto-save logic implementation using a store subscription
let saveTimeout: ReturnType<typeof setTimeout> | null = null

useBuilderStore.subscribe((state, prevState) => {
    // Only trigger auto-save if the state transitions to dirty
    if (state.isDirty && !prevState.isDirty) {
        if (saveTimeout) clearTimeout(saveTimeout)

        saveTimeout = setTimeout(async () => {
            const current = useBuilderStore.getState()
            if (!current.resumeId) return

            current.setSaving(true)

            // 1. Update Resume Title/Theme
            const { error: resumeErr } = await supabase
                .from('resumes')
                .update({ title: current.title, theme: current.theme, updated_at: new Date().toISOString() })
                .eq('id', current.resumeId)

            let hasBlocksError = false;

            // 2. Fetch existing blocks to see what needs to be deleted
            const { data: existingBlocks, error: fetchErr } = await supabase
                .from('blocks')
                .select('id')
                .eq('resume_id', current.resumeId)

            if (fetchErr) {
                console.error("Error fetching existing blocks:", fetchErr)
                hasBlocksError = true;
            } else {
                const currentBlockIds = new Set(current.blocks.map(b => b.id))
                const blocksToDelete = existingBlocks
                    .filter(b => !currentBlockIds.has(b.id))
                    .map(b => b.id)

                // 3. Delete blocks that were removed
                if (blocksToDelete.length > 0) {
                    const { error: deleteErr } = await supabase
                        .from('blocks')
                        .delete()
                        .in('id', blocksToDelete)

                    if (deleteErr) {
                        console.error("Error deleting blocks:", deleteErr)
                        hasBlocksError = true;
                    }
                }
            }


            // 4. Upsert Blocks
            if (current.blocks.length > 0) {
                const blocksToUpsert = current.blocks.map(b => ({
                    id: b.id,
                    resume_id: current.resumeId,
                    type: b.type,
                    order_index: b.order_index,
                    content: b.content,
                    styles: b.styles || {}
                }))
                const { error: blocksErr } = await supabase
                    .from('blocks')
                    .upsert(blocksToUpsert)

                if (blocksErr) {
                    console.error("Error saving blocks:", blocksErr)
                    hasBlocksError = true;
                }
            }

            if (resumeErr) {
                console.error("Error saving resume:", resumeErr)
                toast.error("Failed to save resume")
            } else if (hasBlocksError) {
                toast.error("Failed to sync some blocks")
            }

            // Reset dirty state and update lastSaved
            current.setClean()

        }, 1500) // 1.5s debounce
    }
})
