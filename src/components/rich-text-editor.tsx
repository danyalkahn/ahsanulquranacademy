"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-[280px] rounded-lg border border-border bg-white px-4 py-3 outline-none focus:border-primary",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded px-2.5 py-1 text-xs font-medium transition ${
      active ? "bg-primary text-white" : "bg-black/5 text-muted hover:text-foreground"
    }`;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          Bullets
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          Numbered
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={btn(editor.isActive("link"))}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
