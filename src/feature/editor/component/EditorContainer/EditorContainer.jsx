import { useEffect } from 'react';

import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import {
  BackgroundColor,
  Color,
  FontFamily,
  TextStyle,
} from '@tiptap/extension-text-style';
import { EditorContent, Extension,useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { EnterKeyHandler } from '@/feature/editor/component/extensions/EnterKeyHandler';
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

export default function EditorContainer({ placeholder, text, setText, onEditorReady }) {
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
    onCreate: ({ editor }) => {
      if (onEditorReady) onEditorReady(editor);
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

      <EditorContent editor={editor} />

    </>
  );
}
