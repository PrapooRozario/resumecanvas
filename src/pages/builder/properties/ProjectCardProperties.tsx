import { useState } from 'react'
import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { supabase } from '@/lib/supabase'
import { Upload, Trash2 } from 'lucide-react'

interface ProjectCardPropertiesProps {
    block: Block
}

export function ProjectCardProperties({ block }: ProjectCardPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const title = content.title ?? ''
    const description = content.description ?? ''
    const url = content.url ?? ''
    const imageUrl = content.imageUrl ?? ''

    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const handleChange = (key: string, value: any) => {
        updateBlock(block.id, {
            content: { ...content, [key]: value }
        })
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadError(null)

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `project_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `project_images/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadErr } = await supabase.storage
                .from('resume-photos')
                .upload(filePath, file)

            if (uploadErr) throw uploadErr

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('resume-photos')
                .getPublicUrl(filePath)

            // Update block
            handleChange('imageUrl', publicUrl)
        } catch (err: any) {
            console.error("Upload failed", err)
            setUploadError(err.message || 'Failed to upload image')
        } finally {
            setIsUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="space-y-4">

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Project Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Acme OS"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full min-h-[80px] p-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-y"
                    placeholder="What did you build?"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">Project URL</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full h-8 px-2.5 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. https://github.com/..."
                />
            </div>

            <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Thumbnail Image (Optional)
                </label>

                {imageUrl ? (
                    <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-surface-2">
                        <img src={imageUrl} alt="Project thumbnail preview" className="w-12 h-8 rounded object-cover shadow-sm bg-background border border-border" />
                        <div className="flex-1 truncate">
                            <p className="text-xs text-text-secondary truncate">Thumbnail uploaded</p>
                        </div>
                        <button
                            onClick={() => handleChange('imageUrl', '')}
                            className="p-1.5 text-text-muted hover:text-destructive transition-colors rounded"
                            title="Remove Photo"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="hidden"
                            id={`project-photo-upload-${block.id}`}
                        />
                        <label
                            htmlFor={`project-photo-upload-${block.id}`}
                            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-surface-2 hover:bg-surface transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className="flex flex-col items-center justify-center">
                                {isUploading ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin mb-2" />
                                ) : (
                                    <Upload className="w-5 h-5 text-text-muted mb-2" />
                                )}
                                <p className="text-xs text-text-secondary">
                                    <span className="font-semibold">{isUploading ? 'Uploading...' : 'Upload thumbnail'}</span>
                                </p>
                            </div>
                        </label>
                    </div>
                )}
                {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            </div>

        </div>
    )
}
