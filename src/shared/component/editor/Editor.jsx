import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, Color, BackgroundColor, FontFamily } from '@tiptap/extension-text-style';
import Toolbar from './Toolbar';
import styles from './Editor.module.css';

export default function Editor({ placeholder, setText }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
  });

  if (!editor) return null;

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
}
