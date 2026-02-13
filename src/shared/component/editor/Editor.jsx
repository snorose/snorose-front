import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

import styles from './Editor.module.css';

export default function Editor({ placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder,
      }),
    ],
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
      {/*<FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>*/}
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  );
}
