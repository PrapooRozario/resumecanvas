import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBuilderStore } from '@/store/useBuilderStore'
import { ResumeTemplate } from '@/components/resume/ResumeTemplate'

export function CenterPanel() {
    const { blocks, theme, selectBlock } = useBuilderStore()
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-drop-zone',
        data: { isCanvas: true }
    })

    return (
        <main className="flex-1 h-full bg-canvas overflow-y-auto relative flex flex-col items-center py-12" onClick={() => selectBlock(null)}>
            {/* A4 Canvas Frame */}
            <div
                ref={setNodeRef}
                className={`w-full max-w-[794px] min-h-[1123px] shadow-sm flex flex-col transition-all duration-200`}
                style={{
                    backgroundColor: theme === 'dark' ? '#0f0f0f' : '#ffffff',
                }}
                onClick={(e) => e.stopPropagation()}
            >

                {blocks.length === 0 ? (
                    <div className={`flex-1 w-auto  flex flex-col items-center justify-center p-8 text-center m-8 bg-transparent transition-all text-text-secondary`}>
                        <div className={`p-4 rounded-full mb-5 transition-colors`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 opacity-40">
                                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium mb-1">
                            {isOver ? 'Release to add block' : 'Drag blocks here to start building'}
                        </p>
                        <p className="text-xs opacity-60 mb-6">
                            Pick any block from the panel on the left
                        </p>
                     
                    </div>
                ) : (
                    /* Live ResumeTemplate - using interactive=true so it wraps elements in DraggableBlock internally */
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <ResumeTemplate blocks={blocks} theme={theme} interactive={true} />
                    </SortableContext>
                )}

            </div>
        </main>
    )
}
