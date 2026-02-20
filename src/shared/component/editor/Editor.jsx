import { EditorContent, EditorProvider } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Placeholder } from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import BubbleMenuButtons from './BubbleMenuButtons';
import styles from './Editor.module.css';

export default function Editor({ placeholder, onChange }) {
  const extensions = [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    FontFamily,
    Placeholder.configure({
      emptyEditorClass: 'is-editor-empty',
      placeholder,
    }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ];

  return (
    <div className={styles.editorWrapper}>
      <EditorProvider
        extensions={extensions}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          onChange?.(html);
        }}
        slotBefore={
          <BubbleMenu>
            <BubbleMenuButtons />
          </BubbleMenu>
        }
      >
        <EditorContent className={styles.tiptapEditor} />
      </EditorProvider>
    </div>
  );
}
