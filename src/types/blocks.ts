export type BlockType =
    | 'heading'
    | 'text'
    | 'photo'
    | 'experience'
    | 'education'
    | 'skills'
    | 'project_card'
    | 'social_links'
    | 'divider'
    | 'section'

export interface Block {
    id: string
    resume_id?: string
    type: BlockType
    order_index: number
    content: Record<string, any>
    styles?: Record<string, string>
    created_at?: string
}
