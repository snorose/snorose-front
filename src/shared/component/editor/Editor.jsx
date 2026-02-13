import { useEditor, EditorContent, EditorProvider } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

import BubbleMenuButtons from './BubbleMenuButtons';

import styles from './Editor.module.css';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, Color, BackgroundColor, FontFamily } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Toolbar from './Toolbar';
import styles from './Editor.module.css';

export default function Editor({ placeholder, setText }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ 
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      TextStyle,
      Color,
      BackgroundColor,
      FontFamily,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder,
      }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (setText) setText(editor); 
    },
  });

export default function Editor({ placeholder, onChange }) {
  const extensions = [
    StarterKit,
    Placeholder.configure({
      emptyEditorClass: 'is-editor-empty',
      placeholder,
    }),
  ];

  return (
    <EditorProvider
      extensions={extensions}
      onUpdate={({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      }}
    >
      <EditorContent />

      <BubbleMenu>
        <BubbleMenuButtons />
      </BubbleMenu>
    </EditorProvider>
    <> 
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />

      {/*<FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>*/}
      {/*<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/}
    </>
  );
}