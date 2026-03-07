'use client'

import { useState, useCallback, useRef } from 'react'

import Image from 'next/image'

import { Button } from '@repo/ui'

import { Upload04Icon, XCircleIcon } from '@/lib/icons'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
}

/**
 * Image upload component with drag-and-drop support
 * Validates file type and size before upload
 */
export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Invalid file type. Please upload JPEG, PNG, or WebP images only.'
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return 'File size exceeds 10MB limit.'
      }

      return null
    },
    []
  )

  const handleFile = useCallback(
    async (file: File) => {
      setIsValidating(true)

      const error = validateFile(file)
      if (error) {
        onError?.(error)
        setIsValidating(false)
        return
      }

      // Convert to base64 data URL so it can be sent to fal.ai for image-to-image
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result as string)
      }
      reader.readAsDataURL(file)

      setIsValidating(false)
    },
    [validateFile, onChange, onError]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  if (value) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
        <Image
          src={value}
          alt="Product image preview"
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <Button
          variant="destructive"
          size="sm"
          className="absolute right-2 top-2"
          onClick={handleRemove}
          aria-label="Remove image"
        >
          <XCircleIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
      } aspect-square`}
      role="button"
      tabIndex={0}
      aria-label="Upload product image"
      aria-describedby="upload-instructions"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <Upload04Icon className="mb-3 h-12 w-12 text-muted-foreground" />

      <p className="mb-1 text-sm font-medium" id="upload-instructions">
        {isValidating ? 'Validating...' : isDragging ? 'Drop image here' : 'Upload product image'}
      </p>

      <p className="text-xs text-muted-foreground">
        JPEG, PNG, or WebP (max 10MB)
      </p>
    </div>
  )
}
