import { useEffect } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import { useState } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import { EnterKeyHandler } from '@/feature/editor/component/extensions/EnterKeyHandler';
import {
  TextStyle,
  Color,
  BackgroundColor,
  FontFamily,
} from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import FixedMenuEditor from '../FixedMenuEditor/FixedMenuEditor';
import styles from './EditorContainer.module.css';
import { Iframe } from '@/feature/editor/component/extensions/IframeExtension';

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

export default function EditorContainer({ placeholder, text, setText }) {
  const [isInTable, setIsInTable] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        blockquote: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Blockquote,
      EnterKeyHandler,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Table.configure({
        resizable: true,
      }),
      Iframe,
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      BackgroundColor,
      FontFamily,
      FontSize,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder,
      }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (setText) setText(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      setIsInTable(editor.isActive('table'));
    },
  });

  //EditPostPage처럼 initalText(text)가 존재할 시 세팅해줌
  useEffect(() => {
    if (editor && text && editor.isEmpty) {
      editor.commands.setContent(text);
    }
  }, [editor, text]);

  return (
    <>
      <FixedMenuEditor editor={editor} />
      <EditorContent editor={editor} />

      {isInTable && (
        <div type='button' className={styles.tableControls}>
          <button onClick={() => editor.chain().focus().addRowAfter().run()}>
            ➕ 행 추가
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            ➕ 열 추가
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            ➖ 행 삭제
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            ➖ 열 삭제
          </button>
          <button
            type='button'
            className={styles.deleteButton}
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            🗑️ 표 삭제
          </button>
        </div>
      )}
    </>
  );
}
