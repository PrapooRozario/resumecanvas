import { useEffect } from 'react'
import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Link as LinkIcon } from 'lucide-react'

interface TextPropertiesProps {
    block: Block
}

export function TextProperties({ block }: TextPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}
    const html = content.html ?? '<p>Add your bio or description here...</p>'

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false, codeBlock: false, horizontalRule: false, blockquote: false }),
            Link.configure({ openOnClick: false }),
        ],
        content: html,
        onUpdate: ({ editor }) => {
            updateBlock(block.id, {
                content: { ...content, html: editor.getHTML() }
            })
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full p-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all prose prose-sm max-w-none prose-p:leading-[1.7]',
            },
        },
    })

    // Sync external changes (though rare in right panel except on block switch)
    useEffect(() => {
        if (editor && editor.getHTML() !== html) {
            editor.commands.setContent(html)
        }
    }, [block.id]) // Intentionally relying on block.id to reset content if selection changes

    const setLink = () => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL', previousUrl)

        if (url === null) return // cancelled
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    if (!editor) return null

    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Content
            </label>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-md border border-border">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-background shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary hover:bg-background/50'}`}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-background shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary hover:bg-background/50'}`}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-border mx-1" />
                    <button
                        onClick={setLink}
                        className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-background shadow-sm text-accent' : 'text-text-muted hover:text-text-primary hover:bg-background/50'}`}
                        title="Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </div>

                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
