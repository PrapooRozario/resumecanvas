import { useBuilderStore } from '@/store/useBuilderStore'
import { PropertiesPanel } from './PropertiesPanel'
import { useDroppable } from '@dnd-kit/core'

export function RightPanel() {
    const { blocks, selectedBlockId } = useBuilderStore()
    const selectedBlock = blocks.find(b => b.id === selectedBlockId)

    const { setNodeRef } = useDroppable({
        id: 'properties-panel'
    })

    return (
        <aside ref={setNodeRef} className="w-[320px] h-full bg-surface border-l border-border flex flex-col shrink-0">
            <div className="p-4 border-b border-border">
                <h3 className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">Properties</h3>
            </div>

            <div className={`flex-1 overflow-y-auto p-6 flex flex-col ${!selectedBlock ? 'items-center justify-center text-center' : ''}`}>
                {!selectedBlock ? (
                    <p className="text-sm text-text-muted">
                        Select a block to edit its properties
                    </p>
                ) : (
                    <div className="w-full text-left animate-in fade-in zoom-in-95 duration-200">
                        <PropertiesPanel block={selectedBlock} />
                    </div>
                )}
            </div>
        </aside>
    )
}
