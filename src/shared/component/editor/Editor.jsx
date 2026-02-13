import { useEditor, EditorContent, EditorProvider } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

import BubbleMenuButtons from './BubbleMenuButtons';

import styles from './Editor.module.css';

export default function Editor({ placeholder }) {
  const extensions = [
    StarterKit,
    Placeholder.configure({
      emptyEditorClass: 'is-editor-empty',
      placeholder,
    }),
  ];

  return (
    <EditorProvider extensions={extensions}>
      <EditorContent />

      <BubbleMenu>
        <BubbleMenuButtons />
      </BubbleMenu>
    </EditorProvider>
  );
}
