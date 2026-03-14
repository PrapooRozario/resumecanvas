import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// We removed BlockRenderer completely, so we accept an overrideRender prop
// which is the raw React element from ResumeTemplate
interface DraggableBlockProps {
    block: Block
    overrideRender?: React.ReactNode
}

export function DraggableBlock({ block, overrideRender }: DraggableBlockProps) {
    const { selectedBlockId, selectBlock, removeBlock } = useBuilderStore()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: block.id,
        data: { isCanvasItem: true, block }
    })

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 50 : 1,
    }

    const isSelected = selectedBlockId === block.id

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        removeBlock(block.id)
        setIsDeleteDialogOpen(false)
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                tabIndex={0}
          className={`relative group w-full rounded-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white ${
  isDragging
    ? 'outline-none ring-0'
    : isSelected
    ? 'outline outline-2 outline-offset-2 outline-blue-600 dark:outline-blue-400'
    : 'hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-neutral-600 dark:hover:outline-neutral-300'
}`}
                onClick={(e) => { e.stopPropagation(); selectBlock(block.id); }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        selectBlock(block.id);
                    }
                }}
            >
                {/* Drag Handle (Left) */}
                <div
                    {...attributes}
                    {...listeners}
                    className={`absolute -left-7 top-1/2 -translate-y-1/2 transition-opacity p-0.5 bg-surface-2 border border-border rounded cursor-grab shadow-sm z-20 ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <GripVertical className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Actions (Top Right) — only on hover */}
                {!isDragging && (
                    <div className="absolute -top-3 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 z-20 bg-surface-2 border border-border rounded-md px-1 py-0.5">
                        <button
                            onClick={handleDeleteClick}
                            className="p-1 text-white hover:text-red-600 transition-colors rounded"
                            title="Delete"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Block content injected from ResumeTemplate */}
                {overrideRender}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen}  onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="w-fit">
                    <DialogHeader>
                        <DialogTitle>Delete Block</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this block? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
