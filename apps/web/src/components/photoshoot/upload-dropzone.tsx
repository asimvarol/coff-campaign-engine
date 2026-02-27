'use client'

import { useState, useCallback } from 'react'
import { Upload, XCircle } from 'lucide-react'
import { Button } from '@repo/ui'
import { cn } from '@repo/ui'

interface UploadDropzoneProps {
  onImageSelect: (imageUrl: string) => void
  selectedImage: string | null
  onRemove: () => void
}

export function UploadDropzone({ onImageSelect, selectedImage, onRemove }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageSelect(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageSelect(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect]
  )

  if (selectedImage) {
    return (
      <div className="relative">
        <img
          src={selectedImage}
          alt="Product preview"
          className="w-full rounded-lg border border-border object-cover"
          style={{ maxHeight: '400px' }}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="absolute right-2 top-2"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center">
        <Upload className="mb-3 h-12 w-12 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium text-foreground">
          Drop product image or click to upload
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
      </label>
    </div>
  )
}
