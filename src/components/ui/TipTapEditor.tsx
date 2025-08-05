"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Undo, Redo } from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[120px] outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`;

  return (
    <div className="border border-gray-300 rounded-xl bg-white">
      <div className="flex gap-2 p-2 border-b-2 bg-gray-100">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
        >
          <Strikethrough size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonClass(false)}
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonClass(false)}
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="p-4">
        <EditorContent editor={editor} className="min-h-[120px]" />
      </div>
    </div>
  );
}
