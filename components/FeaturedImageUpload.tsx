"use client"

import { useState, useRef } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/actions/upload"

interface FeaturedImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export default function FeaturedImageUpload({ value, onChange }: FeaturedImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await processFile(file)
  }

  const clearImage = () => {
    onChange("")
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Process the dropped file
    await processFile(file)
  }

  // Common function to process files
  const processFile = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadImage(formData)

      if (result.error) {
        toast.error(result.error)
      } else if (result.url) {
        onChange(result.url)
        toast.success("Image uploaded successfully")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div
      className={`space-y-4 ${isDragging ? 'ring-2 ring-primary p-4 rounded-md' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative aspect-video rounded-md overflow-hidden border">
          <img
            src={value}
            alt="Featured"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop an image here, or click to select
          </p>
        </div>
      )}
    </div>
  )
}
