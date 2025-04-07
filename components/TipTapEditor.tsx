"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageUploadDialog from "./ImageUploadDialog"
import LinkDialog from "./LinkDialog"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = (url: string) => {
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
  }

  return (
    <div className="border-none">
      <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBold().run()
          }}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }}
          className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }}
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBulletList().run()
          }}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleOrderedList().run()
          }}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleCodeBlock().run()
          }}
          className={editor.isActive("codeBlock") ? "bg-muted" : ""}
        >
          <Code className="h-4 w-4" />
        </Button>
        <LinkDialog
          initialUrl={editor.getAttributes("link").href || ""}
          onConfirm={setLink}
          onRemove={removeLink}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className={editor.isActive("link") ? "bg-muted" : ""}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          }
        />
        <ImageUploadDialog
          onImageUploaded={addImage}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          }
        />
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().undo().run()
          }}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().redo().run()
          }}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px] prose prose-sm max-w-none" />
    </div>
  )
}

