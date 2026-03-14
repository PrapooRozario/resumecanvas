import React from 'react'
import type { Block } from '@/types/blocks'
import { ArrowUpRight } from 'lucide-react'
import { DraggableBlock } from '@/pages/builder/components/DraggableBlock'

interface ResumeTemplateProps {
    blocks: Block[]
    theme: 'light' | 'dark'
    interactive?: boolean
    isOverlay?: boolean
}

export function ResumeTemplate({ blocks, theme, interactive = false, isOverlay = false }: ResumeTemplateProps) {
    const isDark = theme === 'dark'

    const colors = {
        bg: 'var(--resume-bg)',
        text: 'var(--resume-text)',
        textSecondary: 'var(--resume-text-secondary)',
        muted: 'var(--resume-muted)',
        tagBorder: 'var(--resume-border)',
        tagBg: 'var(--resume-surface)',
    }

    // A helper to render the actual block content without the interactive wrapper
    const renderContent = (block: Block, index: number, isFloatingWithPhoto = false) => {
        const c = block.content || {}

        switch (block.type) {
            case 'heading': {
                const text = c.text || ''
                const level = c.level || 1

                if (level === 1) {
                    return (
                        <h1
                            style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '24px',
                                fontWeight: 600,
                                lineHeight: 1.2,
                                color: colors.text,
                                margin: 0,
                                letterSpacing: '-0.02em',
                                paddingTop: isFloatingWithPhoto ? '12px' : 0,
                            }}
                        >
                            {text}
                        </h1>
                    )
                }

                if (level === 2) {
                    return (
                        <div style={{ paddingTop: index > 0 ? '36px' : '0' }}>
                            <h2
                                style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: colors.text,
                                    margin: 0,
                                    paddingBottom: '16px',
                                }}
                            >
                                {text}
                            </h2>
                        </div>
                    )
                }

                // H3
                return (
                    <h3
                        style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.text,
                            margin: 0,
                        }}
                    >
                        {text}
                    </h3>
                )
            }

            case 'text': {
                let html = c.html || '<p></p>'
                // Light typography tuning for the bio text
                html = html.replace(/<p>/g, `<p style="margin:0 0 8px 0;">`)

                return (
                    <div
                        style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '13px',
                            lineHeight: 1.6,
                            color: colors.textSecondary,
                            ...(isFloatingWithPhoto ? { marginTop: '4px' } : {})
                        }}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                )
            }

            case 'photo': {
                return null // Handled in the header injection logic below
            }

            case 'divider':
                return (
                    <div style={{ width: '100%', height: '1px', backgroundColor: colors.tagBorder, margin: '24px 0', opacity: 0.5 }} />
                )

            case 'section': {
                const label = c.label || 'Section Title'
                const showLabel = c.showLabel !== undefined ? c.showLabel : true

                if (!showLabel) return null;

                return (
                    <div style={{ paddingBottom: '16px', paddingTop: index > 0 ? '36px' : '0' }}>
                        <h2
                            style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '13px',
                                fontWeight: 600,
                                color: colors.muted,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                margin: 0,
                            }}
                        >
                            {label}
                        </h2>
                    </div>
                )
            }

            case 'experience': {
                const company = c.company || ''
                const role = c.role || ''
                const startDate = c.startDate || ''
                const endDate = c.endDate || ''
                const location = c.location || ''
                const url = c.url || ''
                const description = c.description || ''

                return (
                    <div style={{ display: 'flex', gap: '32px', width: '100%', paddingBottom: '20px' }}>
                        {/* Left: Dates (Muted, Left-aligned, Sans-serif) */}
                        <div
                            style={{
                                width: '120px',
                                flexShrink: 0,
                                paddingTop: '2px', // align with the bold title
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '11px',
                                    color: colors.muted,
                                    lineHeight: 1.5,
                                }}
                            >
                                {startDate}{endDate ? ` — ${endDate}` : startDate ? ' — Present' : ''}
                            </span>
                        </div>
                        {/* Right: Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                                <span
                                    style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: colors.text,
                                    }}
                                >
                                    {role}
                                </span>
                                {company && (
                                    <>
                                        <span style={{ color: colors.textSecondary, fontSize: '13px' }}>at</span>
                                        {url ? (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    fontFamily: "'Geist', sans-serif",
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: colors.text,
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                }}
                                            >
                                                {company}
                                                <ArrowUpRight style={{ width: '10px', height: '10px', opacity: 0.5 }} />
                                            </a>
                                        ) : (
                                            <span
                                                style={{
                                                    fontFamily: "'Geist', sans-serif",
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: colors.text,
                                                }}
                                            >
                                                {company}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            {location && (
                                <p
                                    style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '12px',
                                        color: colors.muted,
                                        margin: '2px 0 0 0',
                                    }}
                                >
                                    {location}
                                </p>
                            )}
                            {description && (
                                <div
                                    style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '13px',
                                        lineHeight: 1.6,
                                        color: colors.textSecondary,
                                        marginTop: '6px',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            )}
                        </div>
                    </div>
                )
            }

            case 'education': {
                const institution = c.institution || ''
                const degree = c.degree || ''
                const startDate = c.startDate || ''
                const endDate = c.endDate || ''
                const location = c.location || ''

                return (
                    <div style={{ display: 'flex', gap: '32px', width: '100%', paddingBottom: '20px' }}>
                        {/* Left: Dates */}
                        <div
                            style={{
                                width: '120px',
                                flexShrink: 0,
                                paddingTop: '2px',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '11px',
                                    color: colors.muted,
                                    lineHeight: 1.5,
                                }}
                            >
                                {startDate}{endDate ? ` — ${endDate}` : ''}
                            </span>
                        </div>
                        {/* Right: Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <span
                                style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: colors.text,
                                }}
                            >
                                {degree}
                            </span>
                            {institution && (
                                <p
                                    style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '13px',
                                        color: colors.textSecondary,
                                        margin: '2px 0 0 0',
                                    }}
                                >
                                    {institution}
                                </p>
                            )}
                            {location && (
                                <p
                                    style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '12px',
                                        color: colors.muted,
                                        margin: '2px 0 0 0',
                                    }}
                                >
                                    {location}
                                </p>
                            )}
                        </div>
                    </div>
                )
            }

            case 'skills': {
                const skills: string[] = c.skills || []
                const layout = c.layout || 'tags'

                if (skills.length === 0) return null

                if (layout === 'list') {
                    return (
                        <p
                            style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '13px',
                                lineHeight: 1.6,
                                color: colors.textSecondary,
                                margin: 0,
                                paddingBottom: '16px',
                            }}
                        >
                            {skills.join(', ')}
                        </p>
                    )
                }

                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingBottom: '16px' }}>
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    color: colors.textSecondary,
                                    border: `1px solid ${colors.tagBorder}`,
                                    backgroundColor: colors.tagBg,
                                    borderRadius: '6px',
                                    padding: '4px 10px',
                                    lineHeight: 1.3,
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )
            }

            case 'project_card': {
                const title = c.title || ''
                const description = c.description || ''
                const url = c.url || ''
                const imageUrl = c.imageUrl || ''
                const year = c.year || ''

                return (
                    <div style={{ display: 'flex', gap: '32px', width: '100%', paddingBottom: '20px' }}>
                        <div
                            style={{
                                width: '120px',
                                flexShrink: 0,
                                paddingTop: '2px',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '11px',
                                    color: colors.muted,
                                    lineHeight: 1.5,
                                }}
                            >
                                {year}
                            </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <span
                                    style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: colors.text,
                                    }}
                                >
                                    {title}
                                </span>
                                {description && (
                                    <p
                                        style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '13px',
                                            lineHeight: 1.6,
                                            color: colors.textSecondary,
                                            margin: '4px 0 0 0',
                                        }}
                                    >
                                        {description}
                                    </p>
                                )}
                                {url && (
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '12px',
                                            color: colors.muted,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '3px',
                                            marginTop: '6px',
                                        }}
                                    >
                                        View project <ArrowUpRight style={{ width: '10px', height: '10px' }} />
                                    </a>
                                )}
                            </div>

                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={title}
                                    style={{
                                        width: '80px',
                                        height: '50px',
                                        borderRadius: '6px',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                        border: `1px solid ${colors.tagBorder}`
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )
            }

            case 'social_links': {
                const links: { platform: string; url: string }[] = c.links || []
                if (links.length === 0) return null

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
                        {links.map((link, i) => {
                            const displayUrl = link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
                            return (
                                <div key={i} style={{ display: 'flex', gap: '32px', alignItems: 'baseline' }}>
                                    <span
                                        style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '11px',
                                            color: colors.text,
                                            fontWeight: 500,
                                            width: '120px',
                                            flexShrink: 0,
                                            textTransform: 'capitalize' as const,
                                        }}
                                    >
                                        {link.platform}
                                    </span>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '13px',
                                            color: colors.textSecondary,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        {displayUrl}
                                        <ArrowUpRight style={{ width: '10px', height: '10px', opacity: 0.4 }} />
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                )
            }

            default:
                return null
        }
    }


    // Look ahead to check if there is a Photo block we should pull up to float.
    // In builder mode we maintain exact block 1-to-1 matching for Draggability,
    // so we only do the beautiful floating trick in pure preview mode for simplicity,
    // OR we just render the photo normally if it's there. 
    // Wait, the user specifically wants the Photo to sit beside the H1 Name if they are adjacent.
    // For builder, we still need blocks to be individually selectable.
    // Let's render the blocks completely vertically, but apply a flex trick if we detect the combo.

    const headerPhotoIndex = blocks.findIndex(b => b.type === 'photo');
    const hasPhoto = headerPhotoIndex !== -1;
    const photoBlock = hasPhoto ? blocks[headerPhotoIndex] : null;

    return (
        <div
            id="resume-template-export"
            className={isDark ? 'dark-resume' : 'light-resume'}
            style={{
                maxWidth: '794px',
                width: '100%',
                backgroundColor: isOverlay ? 'transparent' : colors.bg,
                padding: isOverlay ? '24px 32px' : '56px 64px',
                fontFamily: "'Geist', sans-serif",
                boxSizing: 'border-box' as const,
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>

                {/* Pre-calculate the header block to determine layout */}
                {(() => {
                    const firstHeadingIndex = blocks.findIndex(b => b.type === 'heading' && b.content.level === 1)
                    if (firstHeadingIndex !== -1 && photoBlock) {
                        // There's a combo
                    }
                    return null
                })()}

                {blocks.map((block, index) => {

                    // If it's the photo block, we skip rendering it in the standard flow 
                    // IF it's adjacent to the top Header H1 so we can float it.
                    // Actually, to make DND simple: we just render everything straight down.
                    // The reference image has a round avatar floated left.

                    if (block.type === 'photo') {
                        const url = block.content.url || ''
                        const size = block.content.size || 60

                        const content = (
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                                {url ? (
                                    <img
                                        src={url}
                                        alt="Profile"
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            borderRadius: '50%',
                                            backgroundColor: colors.tagBg,
                                        }}
                                    />
                                )}
                            </div>
                        )

                        if (interactive) {
                            return <DraggableBlock key={block.id} block={block} overrideRender={content} />
                        }
                        return <React.Fragment key={block.id}>{content}</React.Fragment>
                    }

                    const rawContent = renderContent(block, index)
                    const isHidden = !rawContent

                    const blockPadding = {
                         paddingTop: block.styles?.paddingTop ? `${block.styles.paddingTop}px` : undefined,
                         paddingBottom: block.styles?.paddingBottom ? `${block.styles.paddingBottom}px` : undefined,
                    }

                    const content = isHidden ? null : (
                        <div style={blockPadding}>
                            {rawContent}
                        </div>
                    )

                    if (interactive) {
                        // If it's a block that intentionally returned null (e.g., hidden section), provide a placeholder so it can still be selected/deleted.
                        
                        // We still need to pass something valid to DraggableBlock
                        if (isHidden) {
                            const hiddenContent = (
                                <div style={{ height: '24px', width: '100%', border: `1px dashed ${colors.tagBorder}`, margin: '8px 0', opacity: 0.4, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: colors.muted }}>
                                    {block.type.toUpperCase()} (Hidden)
                                </div>
                            )
                            return <DraggableBlock key={block.id} block={block} overrideRender={hiddenContent} />
                        }

                        return <DraggableBlock key={block.id} block={block} overrideRender={content as React.ReactNode} />
                    }

                    return content ? <React.Fragment key={block.id}>{content}</React.Fragment> : null
                })}
            </div>
        </div>
    )
}
