import React from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';

import styles from './BubbleMenuButtons.module.css';

export default function BubbleMenuButtons() {
  const { editor } = useCurrentEditor();
  const { isBold, isItalic, isStrike } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isStrike: editor.isActive('strike'),
    }),
  });

  if (!editor) return null;

  return (
    <div>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${styles.btn} ${isBold ? styles.activeBtn : ''}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${styles.btn} ${isItalic ? styles.activeBtn : ''}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${styles.btn} ${isStrike ? styles.activeBtn : ''}`}
      >
        Strike
      </button>
    </div>
  );
}
