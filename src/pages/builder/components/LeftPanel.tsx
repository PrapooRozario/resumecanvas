import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Search, Type, AlignLeft, Image, Minus, Briefcase, GraduationCap, Tags, LayoutTemplate, Link as LinkIcon, Square } from 'lucide-react'

// Draggable Block tile
function BlockTile({ icon: Icon, label, type, onClick }: { icon: any, label: string, type: string, onClick: () => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: { type, label, isSidebarItem: true, icon: Icon }
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`flex items-center gap-3 p-2 border border-border rounded-md bg-background cursor-grab hover:bg-surface-2 hover:border-accent/40 transition-all ${isDragging ? 'opacity-50' : ''}`}
        >
            <span className="p-1.5 bg-surface rounded text-text-secondary">
                <Icon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-medium text-text-primary">{label}</span>
        </div>
    )
}

import { useBuilderStore } from '@/store/useBuilderStore'

export function LeftPanel() {
    const [search, setSearch] = useState('')
    const { selectBlock, addBlock, blocks } = useBuilderStore()
    
    const handleSidebarTileClick = (type: string) => {
        // Fallback for click to add: generate block content, don't auto-select
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
        addBlock({
            id: crypto.randomUUID(),
            type: type as any,
            order_index: blocks.length,
            content: defaultContent,
            styles: {}
        });
    }

    return (
        <aside className="w-[280px] h-full bg-surface border-r border-border flex flex-col shrink-0" onClick={() => selectBlock(null)}>
            <div className="p-4 border-b border-border">
                <h3 className="text-[10px] font-semibold tracking-widest text-text-muted uppercase mb-3">Blocks</h3>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-text-muted" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        title="Search blocks"
                        placeholder="Search blocks..."
                        className="w-full h-8 pl-8 pr-3 bg-surface-2 border border-border rounded-md text-xs placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all text-text-primary"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Content Blocks */}
                <section>
                    <h4 className="text-[10px] font-semibold tracking-widest text-text-muted uppercase mb-3">Content Blocks</h4>
                    <div className="flex flex-col gap-2">
                        <BlockTile type="heading" icon={Type} label="Heading" onClick={() => handleSidebarTileClick('heading')} />
                        <BlockTile type="text" icon={AlignLeft} label="Text" onClick={() => handleSidebarTileClick('text')} />
                        <BlockTile type="photo" icon={Image} label="Photo" onClick={() => handleSidebarTileClick('photo')} />
                        <BlockTile type="divider" icon={Minus} label="Divider" onClick={() => handleSidebarTileClick('divider')} />
                    </div>
                </section>

                {/* Resume Blocks */}
                <section>
                    <h4 className="text-[10px] font-semibold tracking-widest text-text-muted uppercase mb-3">Resume Blocks</h4>
                    <div className="flex flex-col gap-2">
                        <BlockTile type="experience" icon={Briefcase} label="Experience" onClick={() => handleSidebarTileClick('experience')} />
                        <BlockTile type="education" icon={GraduationCap} label="Education" onClick={() => handleSidebarTileClick('education')} />
                        <BlockTile type="skills" icon={Tags} label="Skills" onClick={() => handleSidebarTileClick('skills')} />
                        <BlockTile type="project_card" icon={LayoutTemplate} label="Project Card" onClick={() => handleSidebarTileClick('project_card')} />
                        <BlockTile type="social_links" icon={LinkIcon} label="Social Links" onClick={() => handleSidebarTileClick('social_links')} />
                    </div>
                </section>

                {/* Layout blocks */}
                <section>
                    <h4 className="text-[10px] font-semibold tracking-widest text-text-muted uppercase mb-3">Layout</h4>
                    <div className="flex flex-col gap-2">
                        <BlockTile type="section" icon={Square} label="Section Wrapper" onClick={() => handleSidebarTileClick('section')} />
                    </div>
                </section>

            </div>
        </aside>
    )
}
