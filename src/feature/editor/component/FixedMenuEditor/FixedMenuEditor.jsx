import React, { useState, useRef, useEffect } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaPalette,
  FaFillDrip,
  FaQuoteRight,
  FaLink,
  FaTable,
  FaYoutube,
  FaImage,
} from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import styles from './FixedMenuEditor.module.css';

export default function FixedMenuEditor({ editor }) {
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [fontSizeInput, setFontSizeInput] = useState('');
  const [isSizeInputFocused, setIsSizeInputFocused] = useState(false);

  const textColorRef = useRef(null);
  const bgColorRef = useRef(null);

  const FONT_OPTIONS = [
    { value: 'Arial', label: 'Arial' },
    {
      value: "'Apple SD Gothic Neo', '애플 SD 고딕 Neo'",
      label: 'Apple SD Gothic Neo',
    },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Verdana', label: 'Verdana' },
    { value: "'Malgun Gothic', '맑은 고딕'", label: '맑은 고딕' },
    { value: "'Nanum Gothic', '나눔고딕'", label: '나눔고딕' },
  ];

  const HEADING_OPTIONS = [
    { value: 'paragraph', label: '본문' },
    { value: '1', label: '제목 1 (H1)' },
    { value: '2', label: '제목 2 (H2)' },
    { value: '3', label: '제목 3 (H3)' },
    { value: '4', label: '제목 4 (H4)' },
    { value: '5', label: '제목 5 (H5)' },
    { value: '6', label: '제목 6 (H6)' },
  ];

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    if (editor.isActive('heading', { level: 4 })) return '4';
    if (editor.isActive('heading', { level: 5 })) return '5';
    if (editor.isActive('heading', { level: 6 })) return '6';
    return 'paragraph';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      [
        { ref: textColorRef, setter: setShowTextColor },
        { ref: bgColorRef, setter: setShowBgColor },
      ].forEach(({ ref, setter }) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setter(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 에디터가 아직 준비되지 않았다면 렌더링 안 함
  if (!editor) return null;

  // 1. 에디터에 적용된 현재 폰트 사이즈 가져오기
  const currentEditorFontSize =
    editor.getAttributes('textStyle')?.fontSize?.replace('px', '') || '';

  // 2. 입력창 포커스 여부에 따라 보여줄 값 결정 (입력 중이면 내 타이핑, 아니면 에디터 값)
  const displayFontSize = isSizeInputFocused
    ? fontSizeInput
    : currentEditorFontSize;

  // 3. 엔터 키를 눌렀을 때만 폰트 크기 적용하는 함수
  const handleFontSizeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 폼 제출 등 기본 동작 방지

      const val = fontSizeInput.trim();
      if (val && !isNaN(val)) {
        // 숫자가 입력되었으면 적용하고 에디터로 포커스 돌려줌
        editor
          .chain()
          .focus()
          .setMark('textStyle', { fontSize: `${val}px` })
          .run();
      } else {
        // 비워두고 엔터치면 폰트 사이즈 초기화
        editor.chain().focus().setMark('textStyle', { fontSize: null }).run();
      }
      // 입력 완료 후 포커스 상태 해제
      setIsSizeInputFocused(false);
      e.target.blur();
    }
  };

  return (
    <div className={styles.toolbar}>
      <button
        aria-label='굵게'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold />
      </button>
      <button
        aria-label='기울임체'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FaItalic />
      </button>
      <button
        aria-label='밑줄'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FaUnderline />
      </button>
      <button
        aria-label='취소선'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <FaStrikethrough />
      </button>

      <div ref={textColorRef} className={styles.colorPickerWrapper}>
        <button onClick={() => setShowTextColor((prev) => !prev)}>
          <FaPalette />
        </button>
        {showTextColor && (
          <div className={styles.colorPickerPopup}>
            <ChromePicker
              color={textColor}
              onChange={(color) => {
                setTextColor(color.hex);
                editor
                  .chain()
                  .focus()
                  .setMark('textStyle', { color: color.hex })
                  .run();
              }}
              disableAlpha
            />
          </div>
        )}
      </div>

      {/* 배경색 팔레트 */}
      <div ref={bgColorRef} className={styles.bgColorWrapper}>
        <button onClick={() => setShowBgColor((prev) => !prev)}>
          <FaFillDrip />
        </button>
        {showBgColor && (
          <div className={styles.bgColorPopup}>
            <ChromePicker
              color={bgColor}
              onChange={(color) => {
                setBgColor(color.hex);
                editor
                  .chain()
                  .focus()
                  .setMark('textStyle', { backgroundColor: color.hex })
                  .run();
              }}
              disableAlpha
            />
            <button
              className={styles.cancelButton}
              onClick={() => {
                setBgColor('#ffffff');
                editor
                  .chain()
                  .focus()
                  .setMark('textStyle', { backgroundColor: null })
                  .run();
                setShowBgColor(false);
              }}
            >
              배경색 취소
            </button>
          </div>
        )}
      </div>

      <select
        onChange={(e) => {
          const font = e.target.value;
          editor
            .chain()
            .focus()
            .setMark('textStyle', { fontFamily: font })
            .run();
        }}
        defaultValue='default'
        className={styles.selectBox}
      >
        <option value='default' disabled>
          폰트 선택
        </option>
        {FONT_OPTIONS.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>

      <div className={styles.divider} />

      <select
        value={getCurrentHeading()}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .setHeading({ level: parseInt(value, 10) })
              .run();
          }
        }}
        className={styles.selectBox}
      >
        {HEADING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className={styles.fontSizeInputWrapper}>
        <input
          type='number'
          value={displayFontSize}
          placeholder='크기'
          className={styles.fontSizeInput}
          onFocus={() => {
            setIsSizeInputFocused(true);
            setFontSizeInput(currentEditorFontSize); // 포커스 시 현재 크기로 세팅
          }}
          onBlur={() => {
            setIsSizeInputFocused(false); // 포커스 잃으면 다시 에디터 값으로 원복
          }}
          onChange={(e) => {
            setFontSizeInput(e.target.value); // 타이핑할 때는 State만 변경
          }}
          onKeyDown={handleFontSizeKeyDown} // 엔터 키 이벤트
        />
        <span className={styles.fontSizeLabel}>px</span>
      </div>

      <div className={styles.divider} />

      <button
        aria-label='왼쪽 정렬'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <FaAlignLeft />
      </button>
      <button
        aria-label='가운데 정렬'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <FaAlignCenter />
      </button>
      <button
        aria-label='오른쪽 정렬'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <FaAlignRight />
      </button>
      <button
        aria-label='토글 정렬'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FaListUl />
      </button>
      <button
        aria-label='순서 정렬'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FaListOl />
      </button>

      <button
        type='button'
        aria-label='인용구'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FaQuoteRight />
      </button>

      <button
        type='button'
        aria-label='링크 삽입'
        onClick={() => {
          const url = window.prompt('링크 주소를 입력하세요');
          if (!url) return;

          // https 프로토콜 자동 추가
          const protocolRegex = /^(https?:\/\/)/i;
          const formattedUrl = protocolRegex.test(url) ? url : `https://${url}`;

          if (editor.state.selection.empty) {
            // 선택 영역이 없으면 새 텍스트로 삽입
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'text',
                text: formattedUrl,
                marks: [{ type: 'link', attrs: { href: formattedUrl } }],
              })
              .run();
          } else {
            // 선택 영역이 있으면 기존 텍스트에 링크 적용
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: formattedUrl })
              .run();
          }
        }}
      >
        <FaLink />
      </button>

      <button
        type='button'
        aria-label='표 삽입'
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
            .run()
        }
      >
        <FaTable />
      </button>

      <button
        type='button'
        onClick={() => {
          const url = window.prompt('iframe URL 입력');
          if (!url) return;

          let formattedUrl = url;

          // 유튜브 링크 자동 embed 변환
          const youtubeMatch = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
          );

          if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            formattedUrl = `https://www.youtube.com/embed/${videoId}`;
          }

          editor
            .chain()
            .focus()
            .insertContent({
              type: 'iframe',
              attrs: { src: formattedUrl },
            })
            .run();
        }}
      >
        <FaYoutube />
      </button>

      
      <button
        onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
            const file = input.files && input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const src = reader.result;
                if (typeof src === 'string') {
                editor.chain().focus().insertContent({
                    type: 'image',
                    attrs: { src }
                }).run();
                } else {
                }
            };
            reader.readAsDataURL(file);
            };
            input.click();
        }}
        >
        <FaImage />
      </button>

      {/*
      <div className={styles.divider} />
      <button onClick={() => console.log('주석 기능 구현 필요')}><FaCommentDots /></button> */}
    </div>
  );
}
