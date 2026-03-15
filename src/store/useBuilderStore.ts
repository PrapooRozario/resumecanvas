import { create } from 'zustand'
import type { Block } from '@/types/blocks'

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

