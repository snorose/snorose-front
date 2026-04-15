import React, { useEffect,useRef, useState } from 'react';
import {
  FaLink,
  FaQuoteRight,
  FaYoutube,
} from 'react-icons/fa';

import { useEditorState } from '@tiptap/react';

import { Icon } from '@/shared/component';  

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

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
    }),
  });

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
    { value: '1', label: '소제목' },
  ];

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return '1';
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
              editor.chain().focus().unsetColor().run();
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
        style={editorState.isBold ? { '--icon-stroke': 'var(--blue-4)' } : {}}
      >
        <Icon id="bold" width={24} height={24} />
      </button>

      <button
        aria-label='밑줄'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        style={editorState.isUnderline ? { '--icon-stroke': 'var(--blue-4)' } : {}}
      >
        <Icon id="underline" width={24} height={24} />
      </button>

      <button
        aria-label='취소선'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={editorState.isStrike ? { '--icon-stroke': 'var(--blue-4)' } : {}}
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
          const url = window.prompt('iframe URL 입력:');
          if (!url) return;
          let formattedUrl = url;

          const patterns = [
            {
              // YouTube 일반 + Shorts
              regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
              format: (match) => `https://www.youtube.com/embed/${match[1]}`,
            },
            {
              // Instagram Reels
              regex: /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
              format: (match) => `https://www.instagram.com/reel/${match[1]}/embed/`,
            },
            {
              // Instagram Posts
              regex: /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
              format: (match) => `https://www.instagram.com/p/${match[1]}/embed/`,
            },
            {
              // TikTok
              regex: /tiktok\.com\/@[^/]+\/video\/(\d+)/,
              format: (match) => `https://www.tiktok.com/embed/v2/${match[1]}`,
            },
            {
              // X (Twitter)
              regex: /(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/,
              format: (match) => `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`,
            },
            {
              // 네이버 TV
              regex: /tv\.naver\.com\/v\/(\d+)/,
              format: (match) => `https://tv.naver.com/embed/${match[1]}`,
            },
            {
              // Google Maps embed URL
              regex: /google\.com\/maps\/embed/,
              format: () => url,
            },
            {
              // Google Maps 일반 URL
              regex: /google\.com\/maps\/(?:place\/[^/]+\/)?\@([\d.-]+),([\d.-]+)/,
              format: (match) => `https://maps.google.com/maps?q=${match[1]},${match[2]}&output=embed`,
            },
          ];

          for (const pattern of patterns) {
            const match = url.match(pattern.regex);
            if (match) {
              formattedUrl = pattern.format(match);
              break;
            }
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
