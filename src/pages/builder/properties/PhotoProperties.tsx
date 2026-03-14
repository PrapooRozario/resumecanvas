import { useState } from 'react'
import type { Block } from '@/types/blocks'
import { useBuilderStore } from '@/store/useBuilderStore'
import { supabase } from '@/lib/supabase'
import { Upload, Trash2, Circle, Square } from 'lucide-react'

interface PhotoPropertiesProps {
    block: Block
}

export function PhotoProperties({ block }: PhotoPropertiesProps) {
    const { updateBlock } = useBuilderStore()
    const content = block.content || {}

    const url = content.url ?? ''
    const shape = content.shape ?? 'circle'
    const size = content.size ?? 100

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
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `profile_photos/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadErr } = await supabase.storage
                .from('resume-photos')
                .upload(filePath, file)

            if (uploadErr) {
                throw uploadErr
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('resume-photos')
                .getPublicUrl(filePath)

            // Update block
            handleChange('url', publicUrl)
        } catch (err: any) {
            console.error("Upload failed", err)
            setUploadError(err.message || 'Failed to upload image')
        } finally {
            setIsUploading(false)
            // clear input
            e.target.value = ''
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Photo
                </label>

                {url ? (
                    <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-surface-2">
                        <img src={url} alt="Profile preview" className="w-10 h-10 rounded-full object-cover shadow-sm bg-background border border-border" />
                        <div className="flex-1 truncate">
                            <p className="text-xs text-text-secondary truncate">Image uploaded</p>
                        </div>
                        <button
                            onClick={() => handleChange('url', '')}
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
                            id={`photo-upload-${block.id}`}
                        />
                        <label
                            htmlFor={`photo-upload-${block.id}`}
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-surface-2 hover:bg-surface transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading ? (
                                    <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin mb-2" />
                                ) : (
                                    <Upload className="w-6 h-6 text-text-muted mb-2" />
                                )}
                                <p className="mb-1 text-sm text-text-secondary">
                                    <span className="font-semibold">{isUploading ? 'Uploading...' : 'Click to upload'}</span>
                                </p>
                                <p className="text-xs text-text-muted/70">PNG, JPG or WEBP (MAX. 2MB)</p>
                            </div>
                        </label>
                    </div>
                )}
                {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Shape
                </label>
                <div className="flex bg-background border border-border rounded-md p-1">
                    <button
                        onClick={() => handleChange('shape', 'circle')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${shape === 'circle'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <Circle className="w-3.5 h-3.5" /> Circle
                    </button>
                    <button
                        onClick={() => handleChange('shape', 'square')}
                        className={`flex-1 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-sm transition-all ${shape === 'square'
                            ? 'bg-surface shadow-sm text-text-primary'
                            : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                            }`}
                    >
                        <Square className="w-3.5 h-3.5" /> Square
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                        Size
                    </label>
                    <span className="text-xs text-text-muted font-mono">{size}px</span>
                </div>
                <input
                    type="range"
                    min="60"
                    max="160"
                    step="4"
                    value={size}
                    onChange={(e) => handleChange('size', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
            </div>
        </div>
    )
}
