import React, { useEffect, useRef, useState } from 'react';

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

export default function FixedMenuEditor({ editor, isTitleFocused }) {
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

  const handleMouseDown = (e) => {
    if (isTitleFocused) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const runIfEditorFocused = (callback) => {
    if (isTitleFocused) return;

    callback();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      [
        { ref: textColorRef, setter: setShowTextColor },
        { ref: bgColorRef, setter: setShowBgColor },
        { ref: headingRef, setter: setHeadingOpen },
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
    <div className={styles.toolbar} onMouseDown={handleMouseDown}>
      {isTitleFocused && <div className={styles.toolbarBlocker} />}
      <div ref={headingRef} className={styles.headingWrapper}>
        <button
          disabled={isTitleFocused}
          className={styles.headingButton}
          onClick={() => setHeadingOpen((prev) => !prev)}
        >
          {HEADING_OPTIONS.find((o) => o.value === getCurrentHeading())
            ?.label ?? '본문'}

          <Icon
            id='arrow-down'
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
                disabled={isTitleFocused}
                onClick={() => {
                  if (option.value === 'paragraph') {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .setHeading({ level: parseInt(option.value, 10) })
                      .run();
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
          disabled={isTitleFocused}
          onClick={() => setShowTextColor((prev) => !prev)}
          style={{ color: textColor || 'var(--grey-4)' }}
        >
          <Icon id='font-color' width={24} height={24} />
        </button>

        <div
          className={`${styles.colorPaletteInline} ${showTextColor ? styles.open : ''}`}
        >
          {/* 색상 없음 */}
          <button
            className={styles.colorSwatchNone}
            disabled={isTitleFocused}
            title='색상 없음'
            onClick={() => {
              setTextColor('');
              editor.chain().focus().unsetColor().run();
            }}
          >
            <Icon id='no-color' width={28} height={28} />
          </button>

          {/* 고정 색상 */}
          {PRESET_COLORS.map((color) => (
            <button
              disabled={isTitleFocused}
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
          disabled={isTitleFocused}
          onClick={() => setShowBgColor((prev) => !prev)}
          style={{
            '--bg-icon-fill': bgColor || '#E6F7B1',
            '--bg-icon-stroke': bgColor || '#AAD916',
          }}
        >
          <Icon id='bg-color' width={24} height={24} />
        </button>

        <div
          className={`${styles.colorPaletteInline} ${showBgColor ? styles.open : ''}`}
        >
          <button
            disabled={isTitleFocused}
            className={styles.colorSwatchNone}
            title='배경색 없음'
            onClick={() => {
              setBgColor('');
              editor
                .chain()
                .focus()
                .setMark('textStyle', { backgroundColor: null })
                .run();
            }}
          >
            <Icon id='no-color' width={28} height={28} />
          </button>

          {/* 고정 색상 */}
          {PRESET_BG_COLORS.map((color) => (
            <button
              disabled={isTitleFocused}
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
        onClick={() => runIfEditorFocused(() => editor.chain().focus().toggleBold().run())}
        disabled={isTitleFocused}
        style={editorState.isBold ? { '--icon-stroke': 'var(--blue-4)' } : {}}
      >
        <Icon id='bold' width={24} height={24} />
      </button>

      <button
        aria-label='밑줄'
        onClick={() => runIfEditorFocused(() => editor.chain().focus().toggleUnderline().run())}
        disabled={isTitleFocused}
        style={
          editorState.isUnderline ? { '--icon-stroke': 'var(--blue-4)' } : {}
        }
      >
        <Icon id='underline' width={24} height={24} />
      </button>

      <button
        aria-label='취소선'
        onClick={() => runIfEditorFocused(() => editor.chain().focus().toggleStrike().run())}
        disabled={isTitleFocused}
        style={editorState.isStrike ? { '--icon-stroke': 'var(--blue-4)' } : {}}
      >
        <Icon id='strikethrough' width={24} height={24} />
      </button>
    </div>
  );
}
