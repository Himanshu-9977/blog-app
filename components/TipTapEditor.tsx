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
      StarterKit.configure({
        // Disable heading in StarterKit as we'll add our own
        heading: false,
        // Make sure these are enabled and properly configured
        bulletList: true,
        orderedList: true,
        code: true,
        codeBlock: true,
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write your content here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none max-w-none",
      },
    },
    // Fix SSR hydration mismatch
    immediatelyRender: false,
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
    if (url) {
      // First check if text is selected
      if (editor.state.selection.empty) {
        // If no text is selected, insert the URL as a link
        editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run()
      } else {
        // If text is selected, convert it to a link
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
      }
    }
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b sticky top-0 z-10">
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
            editor.chain().focus().toggleCode().run()
          }}
          className={editor.isActive("code") ? "bg-muted" : ""}
        >
          <Code className="h-4 w-4" />
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
          <Code className="h-4 w-4 mr-1" />
          Block
        </Button>
        <LinkDialog
          initialUrl={editor.getAttributes("link").href || ""}
          onConfirm={setLink}
          onRemove={removeLink}
          trigger={
            <Button variant="ghost" size="sm" type="button" className={editor.isActive("link") ? "bg-muted" : ""}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          }
        />
        <ImageUploadDialog
          onImageUploaded={addImage}
          trigger={
            <Button variant="ghost" size="sm" type="button">
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
      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
          padding: 1rem;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror a {
          color: #0000EE;
          text-decoration: underline;
        }
        .ProseMirror code {
          background-color: rgba(97, 97, 97, 0.1);
          border-radius: 3px;
          padding: 0.2em 0.4em;
          font-family: monospace;
        }
      `}</style>
      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none bg-background focus-within:ring-0 focus-within:outline-none"
      />
    </div>
  )
}

