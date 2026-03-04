import { useEditor, EditorContent } from '@tiptap/react';
import { useState } from 'react';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
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

export default function EditorContainer({ placeholder, setText }) {
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      BackgroundColor,
      FontFamily,
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

  return (
    <>
      <FixedMenuEditor editor={editor} />
      <EditorContent editor={editor} />

      {isInTable && (
        <div type="button" className={styles.tableControls}>
          <button onClick={() => editor.chain().focus().addRowAfter().run()}>
            ➕ 행 추가
          </button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            ➕ 열 추가
          </button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()}>
            ➖ 행 삭제
          </button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()}>
            ➖ 열 삭제
          </button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()}>
            🗑️ 표 삭제
          </button>
        </div>
      )}
    </>
  );
}