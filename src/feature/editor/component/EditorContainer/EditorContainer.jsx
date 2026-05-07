import { useEffect, useState } from 'react';

import TipTapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  BackgroundColor,
  Color,
  FontFamily,
  TextStyle,
} from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { EnterKeyHandler } from '@/feature/editor/component/extensions/enterkey-handler-extension';
import { Iframe } from '@/feature/editor/component/extensions/iframe-extension';

import { isAllowedEmbedUrl } from '../../lib/sanitize';
import { formatEmbedUrl, isImageUrl } from '../../utils';
import { FontSize } from '../extensions/font-size-extension';
import LinkBubbleMenu from '../LinkBubbleMenu/LinkBubbleMenu';
import styles from './EditorContainer.module.css';

export default function EditorContainer({
  placeholder,
  text,
  onChangeEditor,
  onEditorReady,
}) {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkMenuData, setLinkMenuData] = useState({
    url: '',
    pos: null,
    coords: null,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      EnterKeyHandler,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Iframe,
      TipTapImage,
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
      if (onChangeEditor) onChangeEditor(editor);

      const { $from, empty } = editor.state.selection;

      // 텍스트를 드래그한 상태면 메뉴 숨김
      if (!empty) {
        if (isLinkMenuOpen) setIsLinkMenuOpen(false);
        return;
      }

      let checkPos = $from.pos;
      let nodeBefore = $from.nodeBefore;

      // 1. 방금 스페이스바를 눌러 링크가 생성된 경우 감지 로직
      // (URL을 치고 스페이스바를 누르면 텍스트 노드가 공백(' ')으로 끝남)
      if (nodeBefore && nodeBefore.isText && nodeBefore.text.endsWith(' ')) {
        // 공백 바로 직전(URL 텍스트)의 노드를 가져오기 위해 위치를 1칸 당김
        const resolved = editor.state.doc.resolve(checkPos - 1);
        nodeBefore = resolved.nodeBefore;
        checkPos = checkPos - 1;
      }

      // 2. 커서 바로 앞의 노드에 'link' 마크가 있는지 검사
      if (nodeBefore && nodeBefore.marks) {
        const linkMark = nodeBefore.marks.find((m) => m.type.name === 'link');

        if (linkMark) {
          const url = linkMark.attrs.href;

          if (isImageUrl(url)) {
            setTimeout(() => {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .deleteSelection()
                .setImage({ src: url })
                .run();
            }, 0);
            return;
          }

          if (!isAllowedEmbedUrl(formatEmbedUrl(url))) {
            if (isLinkMenuOpen) setIsLinkMenuOpen(false);
            return;
          }

          // 화면상의 절대 좌표(픽셀)를 계산하여 팝업 띄울 위치 결정
          const coords = editor.view.coordsAtPos(checkPos);

          if (!isLinkMenuOpen || linkMenuData.url !== url) {
            setLinkMenuData({
              url: linkMark.attrs.href,
              pos: checkPos,
              coords: {
                top: coords.top,
                left: coords.left + 8,
              },
            });
            setIsLinkMenuOpen(true);
          }
          return; // 메뉴를 띄웠으므로 조기 종료
        }
      }

      // 3. 링크 영역을 벗어나서 다른 글씨를 계속 치면 자연스럽게 메뉴 숨김
      if (isLinkMenuOpen) setIsLinkMenuOpen(false);
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

  const handleKeepText = () => {
    setIsLinkMenuOpen(false); // 메뉴 닫기
    editor.commands.focus(); // 에디터 포커스 유지
  };

  const handleConvertIframe = () => {
    const url = linkMenuData.url;
    const formattedUrl = formatEmbedUrl(url);

    editor
      .chain()
      .focus()
      // 1. 커서를 방금 작성된 링크 내부로 강제 이동
      .setTextSelection(linkMenuData.pos - 1)
      // 2. 링크 전체 영역을 블록 지정
      .extendMarkRange('link')
      // 3. 해당 텍스트 삭제
      .deleteSelection()
      // 4. 그 위치에 Iframe 노드 렌더링
      .insertContent({
        type: 'iframe',
        attrs: { src: formattedUrl },
      })
      .run();

    setIsLinkMenuOpen(false);
  };

  return (
    <>
      <div className={styles.editor}>
        <EditorContent editor={editor} />
      </div>

      {isLinkMenuOpen && linkMenuData.coords && (
        <LinkBubbleMenu
          coords={linkMenuData.coords}
          onKeepText={handleKeepText}
          onConvertIframe={handleConvertIframe}
        />
      )}
    </>
  );
}
