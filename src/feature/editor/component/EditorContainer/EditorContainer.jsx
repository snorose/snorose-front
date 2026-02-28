import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {
  TextStyle,
  Color,
  BackgroundColor,
  FontFamily,
} from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';

import FixedMenuEditor from '../FixedMenuEditor/FixedMenuEditor';

export default function EditorContainer({ placeholder, text, setText }) {
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

  //EditPostPage처럼 initalText(text)가 존재할 시 세팅해줌
  useEffect(() => {
    if (editor && text) {
      editor.commands.setContent(text);
    }
  }, [editor, text]);

  return (
    <>
      <FixedMenuEditor editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}
