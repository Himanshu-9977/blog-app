"use client"

import { useState, useRef } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/actions/upload"

interface ImageUploadDialogProps {
  onImageUploaded: (url: string) => void
  trigger: React.ReactNode
}

export default function ImageUploadDialog({ onImageUploaded, trigger }: ImageUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Store the dropped file
  const [droppedFile, setDroppedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    // Use either the dropped file or the file from the input
    const fileToUpload = droppedFile || fileInputRef.current?.files?.[0]

    if (!fileToUpload) {
      toast.error("Please select an image to upload")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", fileToUpload)

      const result = await uploadImage(formData)

      if (result.error) {
        toast.error(result.error)
      } else if (result.url) {
        onImageUploaded(result.url)
        toast.success("Image uploaded successfully")
        setOpen(false)
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
      setPreview(null)
      setDroppedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const clearSelection = () => {
    setPreview(null)
    setDroppedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[300px] max-w-full object-contain rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-md p-12 text-center hover:border-muted-foreground/50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0]

                    // Store the dropped file
                    setDroppedFile(file)

                    // Create preview
                    const reader = new FileReader()
                    reader.onload = () => {
                      setPreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select an image or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose ref={dialogCloseRef} asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !preview}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
