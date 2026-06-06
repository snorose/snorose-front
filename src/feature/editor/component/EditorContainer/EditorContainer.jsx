import { useEffect, useRef } from 'react';

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
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';

import { EnterKeyHandler } from '@/feature/editor/component/extensions/enterkey-handler-extension';
import { Iframe } from '@/feature/editor/component/extensions/iframe-extension';
import { useIframeAutoResize } from '@/feature/editor/hook/useIframeAutoResize';

import { EMBED_SOURCES } from '../../constant';
import { isAllowedEmbedUrl } from '../../lib/sanitize';
import { formatEmbedUrl, isImageUrl } from '../../utils';
import { FontSize } from '../extensions/font-size-extension';
import LinkBubbleMenu from '../LinkBubbleMenu/LinkBubbleMenu';
import styles from './EditorContainer.module.css';

// 커서 바로 앞 링크 마크 정보를 찾아 { url, pos } 반환 (없으면 null)
function getLinkAtCursor(editor) {
  const { $from, empty } = editor.state.selection;
  if (!empty) return null;

  let pos = $from.pos;
  let nodeBefore = $from.nodeBefore;

  // URL 입력 후 스페이스로 막 생성된 링크는 끝이 공백이므로 한 칸 당겨 검사
  if (nodeBefore?.isText && nodeBefore.text.endsWith(' ')) {
    nodeBefore = editor.state.doc.resolve(pos - 1).nodeBefore;
    pos -= 1;
  }

  const linkMark = nodeBefore?.marks?.find((m) => m.type.name === 'link');
  if (!linkMark) return null;

  return { url: linkMark.attrs.href, pos };
}

export default function EditorContainer({
  placeholder,
  text,
  onChangeEditor,
  onEditorReady,
}) {
  // 클릭 핸들러가 참조할 현재 링크 정보 { url, pos }
  const linkInfoRef = useRef(null);
  // '링크' 버튼으로 닫은 항목을 기억해 같은 링크엔 메뉴를 다시 띄우지 않기 위한 키
  const dismissedKeyRef = useRef(null);
  // BubbleMenu의 바깥 floating 요소(position:fixed)를 가리킴
  const bubbleMenuRef = useRef(null);

  useIframeAutoResize();

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
    editorProps: {
      transformPastedHTML(html) {
        if (typeof window === 'undefined' || !html) return html;

        const doc = new DOMParser().parseFromString(html, 'text/html');

        doc.querySelectorAll('img').forEach((img) => {
          const realSrc =
            img.getAttribute('data-lazy-src') ||
            img.getAttribute('data-src') ||
            img.getAttribute('data-original');
          if (realSrc) {
            img.setAttribute('src', realSrc);
          }
        });

        doc.querySelectorAll('[style]').forEach((el) => {
          el.removeAttribute('style');
        });
        doc
          .querySelectorAll('b, strong, u, s, strike, i, em, del')
          .forEach((el) => {
            if (el.parentNode) {
              el.replaceWith(...el.childNodes);
            }
          });
        return doc.body.innerHTML;
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChangeEditor) onChangeEditor(editor);
      // 이미지 URL 링크는 메뉴 없이 즉시 이미지로 변환
      // (임베드 메뉴 노출 여부는 BubbleMenu의 shouldShow가 담당)
      const link = getLinkAtCursor(editor);
      if (link && isImageUrl(link.url)) {
        setTimeout(() => {
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .deleteSelection()
            .setImage({ src: link.url })
            .run();
        }, 0);
      }
    },
    onCreate: ({ editor }) => {
      if (onEditorReady) onEditorReady(editor);
      editor.commands.focus('start');
    },
  });

  //EditPostPage처럼 initalText(text)가 존재할 시 세팅해줌
  useEffect(() => {
    if (editor && text && editor.isEmpty) {
      editor.commands.setContent(text);
    }
  }, [editor, text]);

  // React BubbleMenu는 className/style을 '안쪽 콘텐츠 div'에 적용한다.
  // 실제로 position:fixed로 위치가 잡히는 '바깥 floating 요소'에 z-index를 직접
  // 지정해야 AttachmentBar(z-index:100) 위로 올라온다.
  useEffect(() => {
    bubbleMenuRef.current?.classList.add(styles.linkBubbleMenu);
  }, [editor]);

  // 메뉴를 띄울지 결정 + 클릭 핸들러용 링크 정보 저장
  const shouldShowBubble = ({ editor }) => {
    const link = getLinkAtCursor(editor);

    // 링크가 없거나 / 이미지이거나 / 임베드 불가 URL이면 숨김
    if (
      !link ||
      isImageUrl(link.url) ||
      !isAllowedEmbedUrl(formatEmbedUrl(link.url))
    ) {
      linkInfoRef.current = null;
      return false;
    }

    linkInfoRef.current = link;
    // '링크' 버튼으로 닫은 동일 링크면 다시 띄우지 않음
    return dismissedKeyRef.current !== `${link.pos}:${link.url}`;
  };

  const handleKeepText = () => {
    const link = linkInfoRef.current;
    if (link) dismissedKeyRef.current = `${link.pos}:${link.url}`;
    // 버튼 클릭으로 blur된 에디터를 다시 포커스 → focus 이벤트로 BubbleMenu가
    // shouldShow를 재평가 → dismissedKey 일치로 메뉴 닫힘
    editor.commands.focus();
  };

  const handleConvertIframe = () => {
    const link = linkInfoRef.current;
    if (!link) return;

    const { url, pos } = link;
    const formattedUrl = formatEmbedUrl(url);
    const embedSource = EMBED_SOURCES.find((s) => s.sourcePattern.test(url));

    editor
      .chain()
      .focus()
      // 1. 커서를 방금 작성된 링크 내부로 강제 이동
      .setTextSelection(pos - 1)
      // 2. 링크 전체 영역을 블록 지정
      .extendMarkRange('link')
      // 3. 해당 텍스트 삭제
      .deleteSelection()
      // 4. 그 위치에 Iframe 노드 렌더링
      .insertContent({
        type: 'iframe',
        attrs: {
          src: formattedUrl,
          embedType: embedSource?.name ?? null,
        },
      })
      .run();
    setTimeout(() => {
      editor.commands.focus('end');
    }, 0);
  };

  return (
    <>
      <div className={styles.editor}>
        <EditorContent editor={editor} />
      </div>

      {editor && (
        <BubbleMenu
          ref={bubbleMenuRef}
          editor={editor}
          shouldShow={shouldShowBubble}
          options={{
            placement: 'bottom-start',
            strategy: 'fixed', // 모바일 키보드 대응
            offset: 8,
            flip: true,
            shift: { padding: 8 },
            onShow: () => {
              requestAnimationFrame(() => {
                if (editor && !editor.isDestroyed) {
                  editor.view.dispatch(
                    editor.state.tr.setMeta('bubbleMenu', 'updatePosition')
                  );
                }
              });
            },
          }}
        >
          <LinkBubbleMenu
            onKeepText={handleKeepText}
            onConvertIframe={handleConvertIframe}
          />
        </BubbleMenu>
      )}
    </>
  );
}
