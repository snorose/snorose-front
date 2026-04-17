import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/shared/component';  
import {
  FaQuoteRight,
  FaLink,
  FaYoutube,
} from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import styles from './FixedMenuEditor.module.css';


const PRESET_COLORS = [
  { label: '회색', value: 'var(--grey-4)' },
  { label: '검정', value: 'black' },
  { label: '파랑', value: 'var(--blue-4)' },
  { label: '핑크', value: 'var(--pink-3)' },
];

const PRESET_BG_COLORS = [
  { label: '핑크', value: 'var(--pink-1)' },
  { label: '노랑', value: '#FDFF6C' },
  { label: '연두', value: 'var(--green-2)' },
  { label: '파랑', value: 'var(--blue-2)' },
];

export default function FixedMenuEditor({ editor }) {
  const [textColor, setTextColor] = useState('var(--grey-4)');
  const [bgColor, setBgColor] = useState('');
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  const textColorRef = useRef(null);
  const bgColorRef = useRef(null);

  const [headingOpen, setHeadingOpen] = useState(false);
  const headingRef = useRef(null);

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
        { ref: headingRef, setter: setHeadingOpen}
      ].forEach(({ ref, setter }) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setter(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    
  }, []);

  if (!editor) return null;

  return (
    <div className={styles.toolbar}>

      <div ref={headingRef} className={styles.headingWrapper}>
        <button
          className={styles.headingButton}
          onClick={() => setHeadingOpen(prev => !prev)}
        >
          {HEADING_OPTIONS.find(o => o.value === getCurrentHeading())?.label ?? '본문'}

          <Icon
            id="arrow-down"
            width={12}
            height={6.75}
            className={styles.headingArrow}
            />
        </button>

        {headingOpen && (
          <div className={styles.headingDropdown}>
            {HEADING_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`${styles.headingOption} ${getCurrentHeading() === option.value ? styles.headingOptionActive : ''}`}
                onClick={() => {
                  if (option.value === 'paragraph') {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().setHeading({ level: parseInt(option.value, 10) }).run();
                  }
                  setHeadingOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
  
      <div ref={textColorRef} className={styles.colorPickerWrapper}>

        {/* 폰트 색상 토글 버튼 */}
        <button
          onClick={() => setShowTextColor((prev) => !prev)}
          style={{ color: textColor || 'var(--grey-4)' }}
        >
          <Icon id="font-color" width={24} height={24} />
        </button>

        <div className={`${styles.colorPaletteInline} ${showTextColor ? styles.open : ''}`}>

          {/* 색상 없음 */}
          <button
            className={styles.colorSwatchNone}
            title="색상 없음"
            onClick={() => {
              setTextColor('');
              editor.chain().focus().unsetMark('textStyle').run();
            }}
          >
            <Icon id="no-color" width={28} height={28} />
          </button>

          {/* 고정 색상 */}
          {PRESET_COLORS.map((color) => (
            <button
              key={color.label}
              className={`${styles.colorSwatch} ${textColor === color.value ? styles.selected : ''}`}
              style={{ backgroundColor: color.value }}
              title={color.label}
              onClick={() => {
                setTextColor(color.value);
                editor
                  .chain()
                  .focus()
                  .setMark('textStyle', { color: color.value })
                  .run();
              }}
            />
          ))}

        </div>
      </div>

      <div ref={bgColorRef} className={styles.colorPickerWrapper}>
  
        <button
          onClick={() => setShowBgColor((prev) => !prev)}
          style={{
            '--bg-icon-fill': bgColor || '#E6F7B1',
            '--bg-icon-stroke': bgColor || '#AAD916',
          }}
        >
          <Icon id="bg-color" width={24} height={24} />
        </button>

        <div className={`${styles.colorPaletteInline} ${showBgColor ? styles.open : ''}`}>

          <button
            className={styles.colorSwatchNone}
            title="배경색 없음"
            onClick={() => {
              setBgColor('');
              editor.chain().focus().setMark('textStyle', { backgroundColor: null }).run();
            }}
          >
            <Icon id="no-color" width={28} height={28} />
          </button>

          {/* 고정 색상 */}
          {PRESET_BG_COLORS.map((color) => (
            <button
              key={color.label}
              className={`${styles.colorSwatch} ${bgColor === color.value ? styles.selected : ''}`}
              style={{ backgroundColor: color.value }}
              title={color.label}
              onClick={() => {
                setBgColor(color.value);
                editor
                  .chain()
                  .focus()
                  .setMark('textStyle', { backgroundColor: color.value })
                  .run();
              }}
            />
          ))}

        </div>
      </div>

      <button
        aria-label='굵게'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon id="bold" width={24} height={24} />
      </button>
      <button
        aria-label='밑줄'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon id="underline" width={24} height={24} />
      </button>
      <button
        aria-label='취소선'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Icon id="strikethrough" width={24} height={24} />
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
          const protocolRegex = /^(https?:\/\/)/i;
          const formattedUrl = protocolRegex.test(url) ? url : `https://${url}`;

          if (editor.state.selection.empty) {
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
        onClick={() => {
          const url = window.prompt('iframe URL 입력');
          if (!url) return;
          let formattedUrl = url;
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
            .insertContent({ type: 'iframe', attrs: { src: formattedUrl } })
            .run();
        }}
      >
        <FaYoutube />
      </button>
    </div>
  );
}
