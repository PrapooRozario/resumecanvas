import type { Block, BlockType } from '@/types/blocks'
import { HeadingProperties } from '../properties/HeadingProperties'
import { TextProperties } from '../properties/TextProperties'
import { PhotoProperties } from '../properties/PhotoProperties'
import { DividerProperties } from '../properties/DividerProperties'
import { ExperienceProperties } from '../properties/ExperienceProperties'
import { EducationProperties } from '../properties/EducationProperties'
import { SkillsProperties } from '../properties/SkillsProperties'
import { ProjectCardProperties } from '../properties/ProjectCardProperties'
import { SocialLinksProperties } from '../properties/SocialLinksProperties'
import { SectionProperties } from '../properties/SectionProperties'
import { PaddingProperties } from '../properties/PaddingProperties'

interface PropertiesPanelProps {
    block: Block
}

export function PropertiesPanel({ block }: PropertiesPanelProps) {
    const renderBlockSpecificProperties = () => {
        switch (block.type as BlockType) {
            case 'heading':
                return <HeadingProperties block={block} />
            case 'text':
                return <TextProperties block={block} />
            case 'photo':
                return <PhotoProperties block={block} />
            case 'divider':
                return <DividerProperties block={block} />
            case 'experience':
                return <ExperienceProperties block={block} />
            case 'education':
                return <EducationProperties block={block} />
            case 'skills':
                return <SkillsProperties block={block} />
            case 'project_card':
                return <ProjectCardProperties block={block} />
            case 'social_links':
                return <SocialLinksProperties block={block} />
            case 'section':
                return <SectionProperties block={block} />
            default:
                return (
                    <div className="text-sm text-text-muted italic">
                        No properties available for {block.type}.
                    </div>
                )
        }
    }

    return (
        <div className="space-y-4">
            {renderBlockSpecificProperties()}
            <PaddingProperties block={block} />
        </div>
    )
}
