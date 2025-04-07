"use client"

import { useState, useRef } from "react"
import { LinkIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkDialogProps {
  initialUrl: string
  onConfirm: (url: string) => void
  onRemove: () => void
  trigger: React.ReactNode
}

export default function LinkDialog({ initialUrl, onConfirm, onRemove, trigger }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl || "")
  const [open, setOpen] = useState(false)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (url.trim() === "") {
      onRemove()
    } else {
      // Add https:// if no protocol is specified
      let finalUrl = url
      if (finalUrl && !finalUrl.match(/^https?:\/\//i)) {
        finalUrl = `https://${finalUrl}`
      }
      
      onConfirm(finalUrl)
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
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
          </div>
          <div className="flex justify-between">
            {initialUrl && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  onRemove()
                  setOpen(false)
                }}
              >
                Remove Link
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <DialogClose ref={dialogCloseRef} asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {initialUrl ? "Update" : "Insert"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
