import { useMemo } from 'react';
import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
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
    ], // define your extension array
    immediatelyRender: false,
  });

  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor]);

  if (!editor) return null;

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
      {/*<FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>*/}
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </EditorContext.Provider>
  );
}
