import { useEffect } from 'react'
import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Link as LinkIcon } from 'lucide-react'

interface ExperiencePropertiesProps {
    block: Block
}

export function ExperienceProperties({ block }: ExperiencePropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const company = content.company ?? ''
    const role = content.role ?? ''
    const startDate = content.startDate ?? ''
    const endDate = content.endDate ?? ''
    const location = content.location ?? ''
    const url = content.url ?? ''
    const description = content.description ?? ''

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false, codeBlock: false, horizontalRule: false, blockquote: false }),
            Link.configure({ openOnClick: false }),
        ],
        content: description,
        onUpdate: ({ editor }) => {
            handleChange('description', editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'min-h-[100px] w-full p-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all prose prose-sm max-w-none prose-p:leading-[1.6]',
            },
        },
    })

    useEffect(() => {
        if (editor && editor.getHTML() !== description) {
            editor.commands.setContent(description)
        }
    }, [block.id])

    const setLink = () => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const newUrl = window.prompt('Enter URL', previousUrl)

        if (newUrl === null) return
        if (newUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: newUrl }).run()
    }

    return (
        <div className="space-y-4">

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Company</label>
                <input
                    type="text"
                    value={company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Acme Corp"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Role</label>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Senior Product Designer"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Start Date</label>
                    <input
                        type="text"
                        value={startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="e.g. 2019"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">End Date</label>
                    <input
                        type="text"
                        value={endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        placeholder="e.g. 2021 or Present"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. San Francisco, CA"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Company URL</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. https://acme.com"
                />
            </div>

            {editor && (
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Description</label>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-md border border-border w-fit">
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`p-1 rounded transition-colors ${editor.isActive('bold') ? 'bg-background shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
                                title="Bold"
                            >
                                <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`p-1 rounded transition-colors ${editor.isActive('italic') ? 'bg-background shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
                                title="Italic"
                            >
                                <Italic className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-[1px] h-3 bg-border mx-0.5" />
                            <button
                                onClick={setLink}
                                className={`p-1 rounded transition-colors ${editor.isActive('link') ? 'bg-background shadow-sm text-accent' : 'text-text-muted hover:text-text-primary'}`}
                                title="Link"
                            >
                                <LinkIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <EditorContent editor={editor} />
                    </div>
                </div>
            )}
        </div>
    )
}
