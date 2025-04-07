"use client"
import { useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkDialogProps {
  trigger: ReactNode
  initialUrl: string
  onConfirm: (url: string) => void
  onRemove?: () => void
}

export default function LinkDialog({ trigger, initialUrl, onConfirm, onRemove }: LinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState(initialUrl)

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    onConfirm(url)
    setOpen(false)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onRemove) {
      onRemove()
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleConfirm(e as unknown as React.MouseEvent)
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-between">
          {initialUrl && onRemove && (
            <Button type="button" variant="destructive" onClick={handleRemove}>
              Remove Link
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}