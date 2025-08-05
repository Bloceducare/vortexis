'use client';

import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { FontSize } from '../extensions/Fontsize';

import Heading from '@tiptap/extension-heading';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';

import{ Table} from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';

interface TiptapEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = '',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: { keepMarks: true },
        bulletList: { keepMarks: true },
      }),
      Underline,
      TextStyle,
      FontSize,
      Placeholder.configure({ placeholder }),
      Heading.configure({ levels: [1, 2, 3] }),
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        className: `min-h-[150px] outline-none ${className}`,
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `p-2 rounded hover:bg-gray-300 ${active ? 'bg-gray-300' : ''}`;

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark('fontSize', { fontSize: size }).run();
  };

  return (
    <div className="border border-gray-300 rounded-xl bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-100">
        {/* Text formatting */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}>
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive('underline'))}>
          <UnderlineIcon size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))}>
          <Strikethrough size={16} />
        </button>

        {/* Lists */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))}>
          <ListOrdered size={16} />
        </button>

        {/* Undo/Redo */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={buttonClass(false)}>
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={buttonClass(false)}>
          <Redo size={16} />
        </button>

        {/* Font size */}
        <select
          onChange={(e) => setFontSize(e.target.value)}
          defaultValue=""
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Font Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
        </select>

        {/* Heading */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(editor.isActive('heading', { level: 1 }))}>
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))}>
          H2
        </button>

        {/* Alignment */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClass(editor.isActive({ textAlign: 'left' }))}>
          Left
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClass(editor.isActive({ textAlign: 'center' }))}>
          Center
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClass(editor.isActive({ textAlign: 'right' }))}>
          Right
        </button>

        {/* Color */}
        <input
          type="color"
          className="w-6 h-6 border ml-2"
          onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
        />

        {/* Table Actions */}
        <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={buttonClass(false)}>
          Insert Table
        </button>
        <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={buttonClass(false)}>
          +Col
        </button>
        <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={buttonClass(false)}>
          +Row
        </button>
        <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={buttonClass(false)}>
          ❌Table
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose lg:prose-lg max-w-none list-disc list-inside [&_table]:w-full [&_th]:border [&_td]:border [&_td]:px-3 [&_td]:py-2"
          />
      </div>
    </div>
  );
}



