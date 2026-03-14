import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { supabase } from '@/lib/supabase'
import { useBuilderStore } from '@/store/useBuilderStore'

import { TopToolbar } from './components/TopToolbar'
import { LeftPanel } from './components/LeftPanel'
import { CenterPanel } from './components/CenterPanel'
import { RightPanel } from './components/RightPanel'
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
    const { blocks, addBlock, reorderBlocks, selectBlock, setResume, setClean, theme } = useBuilderStore()
    const [loading, setLoading] = useState(true)

    // Mobile Panel State (hidden on desktop via css)
    const [mobilePanel, setMobilePanel] = useState<'none' | 'left' | 'right'>('none')

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeData, setActiveData] = useState<any>(null);
    const [overId, setOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

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

        // Always clear active drag state first, no matter what
        setActiveId(null);
        setActiveData(null);
        setOverId(null);

        // Guard 1: Nothing was dropped on any target — dropped in empty space
        if (!over) return;

        // Guard 2: Block was dropped back onto the sidebar or another invalid zone
        const isCanvas = over.id === 'canvas-drop-zone';
        const isExistingBlock = blocks.some(b => b.id === over.id);

        if (!isCanvas && !isExistingBlock) return;

        // Guard 3: If the dragged item came FROM the canvas (reorder), not the sidebar
        const isReorder = blocks.some((b) => b.id === active.id);
        
        if (isReorder) {
            handleReorder(active.id as string, over.id as string);
            return;
        }

        // Only reach here if: dragged from sidebar AND dropped on a valid canvas target
        const type = active.data.current?.type;
        const newBlockId = crypto.randomUUID();
        
        const defaultContent = getSidebarBlockPreview(type).content;

        const newBlock: any = {
            id: newBlockId,
            type,
            order_index: blocks.length,
            content: defaultContent,
            styles: {}
        };

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

        selectBlock(newBlockId);
    };

    const handleReorder = (activeIdParam: string, overIdParam: string) => {
        if (activeIdParam !== overIdParam) {
            const oldIndex = blocks.findIndex(b => b.id === activeIdParam);
            const newIndex = blocks.findIndex(b => b.id === overIdParam);
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderBlocks(oldIndex, newIndex);
            }
        }
    }

    const handleDragCancel = () => {
        setActiveId(null);
        setActiveData(null);
        setOverId(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                selectBlock(null)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectBlock])

    useEffect(() => {
        if (!resumeId) {
            navigate('/dashboard')
            return
        }

        const loadData = async () => {
            setLoading(true)

            try {
                const { data: resumeData, error: resumeErr } = await supabase
                    .from('resumes')
                    .select('*')
                    .eq('id', resumeId)
                    .single()

                if (resumeErr || !resumeData) {
                    throw new Error("Resume not found")
                }

                const { data: blocksData, error: blocksErr } = await supabase
                    .from('blocks')
                    .select('*')
                    .eq('resume_id', resumeId)
                    .order('order_index', { ascending: true })

                if (blocksErr) throw blocksErr

                const fetchedBlocks = blocksData ? blocksData.map(b => ({
                    ...b,
                    styles: b.styles || {}
                })) : []

                setResume(resumeId, resumeData.title, fetchedBlocks)
                setTimeout(() => setClean(), 50)
            } catch (err: any) {
                console.error("Resume load failed:", err)
                toast.error("Failed to load resume. It may have been deleted.")
                navigate('/dashboard')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [resumeId, navigate, setResume, setClean])

    if (loading) {
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
                    
                    {/* Main Content Area */}
                    <div className="flex flex-1 overflow-hidden relative">
                        
                        {/* Left Panel - Hidden on mobile unless active */}
                        <div className={`
                            absolute md:relative z-30 h-full w-full md:w-64 lg:w-72 flex-shrink-0 bg-surface border-r border-border transition-transform duration-300 md:transform-none
                            ${mobilePanel === 'left' ? 'translate-x-0' : '-translate-x-full'}
                        `}>
                            <LeftPanel />
                        </div>

                        {/* Center Canvas */}
                        <div className="flex-1 h-full min-w-0" onClick={() => setMobilePanel('none')}>
                            <CenterPanel />
                        </div>

                        {/* Right Panel - Hidden on mobile unless active */}
                        <div className={`
                            absolute right-0 md:relative z-30 h-full w-full md:w-72 lg:w-80 flex-shrink-0 bg-surface border-l border-border transition-transform duration-300 md:transform-none
                            ${mobilePanel === 'right' ? 'translate-x-0' : 'translate-x-full'}
                        `}>
                            <RightPanel />
                        </div>
                        
                    </div>

                    {/* Mobile Bottom Bar (visible only < 768px) */}
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
