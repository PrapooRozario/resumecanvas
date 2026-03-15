import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { useBuilderStore } from '@/store/useBuilderStore'
import { useResume } from '@/hooks/queries/useResume'
import { useBlocks } from '@/hooks/queries/useBlocks'
import { useAddBlock } from '@/hooks/mutations/useAddBlock'
import { useReorderBlocks } from '@/hooks/mutations/useReorderBlocks'

import { TopToolbar } from './components/TopToolbar'
import { LeftPanel } from './components/LeftPanel'
import { CenterPanel } from './components/CenterPanel'
import { RightPanel } from './components/RightPanel'
import { BuilderAutoSave } from './components/BuilderAutoSave'
import { toast } from 'sonner'
import { Loader2, Settings2, Blocks } from 'lucide-react'
import { ResumeTemplate } from '@/components/resume/ResumeTemplate'

const getSidebarBlockPreview = (type: string | null) => {
    let defaultContent: any = {};
    switch (type) {
        case 'heading': defaultContent = { text: 'Heading Text', level: 1 }; break;
        case 'text': defaultContent = { html: '<p>Write your text here...</p>' }; break;
        case 'photo': defaultContent = { url: '', size: 60 }; break;
        case 'section': defaultContent = { label: 'NEW SECTION', showLabel: true }; break;
        case 'experience': defaultContent = { company: 'Company Name', role: 'Job Title', startDate: '2020', endDate: 'Present', location: 'City, State', description: '<p>Describe your responsibilities here...</p>', url: '' }; break;
        case 'education': defaultContent = { institution: 'University Name', degree: 'Degree Name', startDate: '2016', endDate: '2020', location: 'City, State' }; break;
        case 'skills': defaultContent = { skills: ['Skill 1', 'Skill 2', 'Skill 3'], layout: 'tags' }; break;
        case 'project_card': defaultContent = { title: 'Project Name', description: 'Brief description of the project...', year: '2023', url: '', imageUrl: '' }; break;
        case 'social_links': defaultContent = { links: [{ platform: 'github', url: 'https://github.com' }] }; break;
        default: defaultContent = {}; break;
    }
    return {
        id: 'preview-block',
        type: type as any,
        order_index: 0,
        content: defaultContent,
        styles: {}
    };
};

export function BuilderPage() {
    const { resumeId } = useParams()
    const navigate = useNavigate()
    
    // Remote State (React Query)
    const { data: resumeData, isLoading: resumeLoading, isError: resumeError } = useResume(resumeId)
    const { data: blocksData, isLoading: blocksLoading, isError: blocksError } = useBlocks(resumeId)
    
    const addBlockMutation = useAddBlock(resumeId!)
    const reorderBlocksMutation = useReorderBlocks(resumeId!)

    // Local UI State (Zustand)
    const { blocks, addBlock, reorderBlocks, selectBlock, setResume, setClean, theme } = useBuilderStore()

    // Control initial store sync
    const [isInitialized, setIsInitialized] = useState(false)

    // Mobile Panel State
    const [mobilePanel, setMobilePanel] = useState<'none' | 'left' | 'right'>('none')

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeData, setActiveData] = useState<any>(null);
    const [overId, setOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (!resumeId) {
            navigate('/dashboard')
            return
        }
        if (resumeError || blocksError) {
            toast.error("Failed to load resume. It may have been deleted.")
            navigate('/dashboard')
            return
        }
        
        if (!isInitialized && resumeData && blocksData) {
            setResume(resumeId, resumeData.title, blocksData)
            setTimeout(() => setClean(), 50)
            setIsInitialized(true)
        }
    }, [resumeId, resumeData, blocksData, resumeError, blocksError, isInitialized, navigate, setResume, setClean])

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        setActiveData(event.active.data.current);
        setOverId(null);
    };

    const handleDragMove = (event: DragMoveEvent) => {
        setOverId(event.over?.id as string ?? null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);
        setActiveData(null);
        setOverId(null);

        if (!over) return;

        const isCanvas = over.id === 'canvas-drop-zone';
        const isExistingBlock = blocks.some(b => b.id === over.id);

        if (!isCanvas && !isExistingBlock) return;

        const isReorder = blocks.some((b) => b.id === active.id);
        
        if (isReorder) {
            handleReorder(active.id as string, over.id as string);
            return;
        }

        const type = active.data.current?.type;
        const newBlockId = crypto.randomUUID();
        const defaultContent = getSidebarBlockPreview(type).content;

        const newBlock: any = {
            id: newBlockId,
            resume_id: resumeId,
            type,
            order_index: blocks.length,
            content: defaultContent,
            styles: {}
        };

        // UI Update
        if (isCanvas) {
            addBlock(newBlock);
        } else {
            const overIndex = blocks.findIndex(b => b.id === over.id);
            if (overIndex !== -1) {
                addBlock(newBlock, overIndex);
            } else {
                addBlock(newBlock);
            }
        }
        
        // Remote Update
        addBlockMutation.mutate(newBlock, {
            onSuccess: () => setClean() // clear the generic dirty flag
        });

        selectBlock(newBlockId);
    };

    const handleReorder = (activeIdParam: string, overIdParam: string) => {
        if (activeIdParam !== overIdParam) {
            const oldIndex = blocks.findIndex(b => b.id === activeIdParam);
            const newIndex = blocks.findIndex(b => b.id === overIdParam);
            if (oldIndex !== -1 && newIndex !== -1) {
                // UI Update
                reorderBlocks(oldIndex, newIndex);
                
                // We need the NEW ordered array to send to the server
                // `blocks` here is the old state. Since we just triggered `reorderBlocks` synchronously,
                // we'll get the updated state from useBuilderStore.getState().blocks
                const newOrderedBlocks = useBuilderStore.getState().blocks;
                
                // Remote Update
                reorderBlocksMutation.mutate(newOrderedBlocks, {
                    onSuccess: () => setClean()
                });
            }
        }
    }

    const handleDragCancel = () => {
        setActiveId(null);
        setActiveData(null);
        setOverId(null);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                selectBlock(null)
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [selectBlock])

    if (resumeLoading || blocksLoading || !isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-surface-2 gap-4">
                <Loader2 className="w-8 h-8 text-text-primary animate-spin" />
                <p className="text-sm font-medium text-text-muted animate-pulse">Loading canvas...</p>
            </div>
        )
    }

    return (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
                <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-background text-text-primary">
                    <TopToolbar />
                    {resumeId && <BuilderAutoSave resumeId={resumeId} />}
                    
                    <div className="flex flex-1 overflow-hidden relative">
                        <div className={`
                            absolute md:relative z-30 h-full w-full md:w-64 lg:w-72 flex-shrink-0 bg-surface border-r border-border transition-transform duration-300 md:transform-none
                            ${mobilePanel === 'left' ? 'translate-x-0' : '-translate-x-full'}
                        `}>
                            <LeftPanel />
                        </div>

                        <div className="flex-1 h-full min-w-0" onClick={() => setMobilePanel('none')}>
                            <CenterPanel />
                        </div>

                        <div className={`
                            absolute right-0 md:relative z-30 h-full w-full md:w-72 lg:w-80 flex-shrink-0 bg-surface border-l border-border transition-transform duration-300 md:transform-none
                            ${mobilePanel === 'right' ? 'translate-x-0' : 'translate-x-full'}
                        `}>
                            <RightPanel />
                        </div>
                    </div>

                    <div className="md:hidden flex h-16 border-t border-border bg-surface shrink-0">
                        <button 
                            onClick={() => setMobilePanel(p => p === 'left' ? 'none' : 'left')}
                            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobilePanel === 'left' ? 'text-text-primary bg-surface-2' : 'text-text-muted hover:text-text-primary hover:bg-surface-2'}`}
                        >
                            <Blocks className="w-5 h-5" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Blocks</span>
                        </button>
                        <div className="w-[1px] h-full bg-border" />
                        <button 
                            onClick={() => setMobilePanel(p => p === 'right' ? 'none' : 'right')}
                            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobilePanel === 'right' ? 'text-text-primary bg-surface-2' : 'text-text-muted hover:text-text-primary hover:bg-surface-2'}`}
                        >
                            <Settings2 className="w-5 h-5" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Properties</span>
                        </button>
                    </div>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeId ? (
                        <div 
                            className={`transition-all duration-200 shadow-2xl rounded-lg pointer-events-none overflow-hidden ${
                                (overId === 'canvas-drop-zone' || blocks.some(b => b.id === overId))
                                ? 'opacity-90 scale-[1.02] cursor-grabbing ring-1 ring-black/10'
                                : 'opacity-40 scale-100 cursor-not-allowed grayscale'
                            }`} 
                            style={{ width: '794px', backgroundColor: theme === 'dark' ? '#0f0f0f' : '#ffffff' }}
                        >
                            <ResumeTemplate 
                                blocks={[blocks.find(b => b.id === activeId) ?? getSidebarBlockPreview(activeData?.type)] as any} 
                                theme={theme} 
                                interactive={false} 
                                isOverlay={true}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
    )
}
