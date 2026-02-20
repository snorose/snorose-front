import React from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import styles from './BubbleMenuButtons.module.css';

export default function BubbleMenuButtons() {
  const { editor } = useCurrentEditor();

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isStrike: editor.isActive('strike'),
      isUnderline: editor.isActive('underline'),
      isBulletList: editor.isActive('bulletList'),
      isOrderedList: editor.isActive('orderedList'),
      alignLeft: editor.isActive({ textAlign: 'left' }),
      alignCenter: editor.isActive({ textAlign: 'center' }),
      alignRight: editor.isActive({ textAlign: 'right' }),
      currentColor: editor.getAttributes('textStyle').color,
    }),
  });

  if (!editor) return null;

  return (
    <div className={styles.toolbar}>
      {/* 1. 텍스트 기본 서식 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.btn} ${state.isBold ? styles.active : ''}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.btn} ${state.isItalic ? styles.active : ''}`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${styles.btn} ${state.isUnderline ? styles.active : ''}`}
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${styles.btn} ${state.isStrike ? styles.active : ''}`}
        >
          S
        </button>
      </div>

      {/* 2. 폰트 종류 */}
      <select
        onChange={(e) =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
        className={styles.select}
      >
        <option value='Inter'>Default</option>
        <option value='Comic Sans MS, Comic Sans'>Comic Sans</option>
        <option value='serif'>Serif</option>
        <option value='monospace'>Monospace</option>
      </select>

      {/* 3. 색상 (글자색 / 배경색) */}
      <div className={styles.group}>
        {/* 글자 색상 선택 */}
        <div className={styles.colorPickerWrapper}>
          <input
            type='color'
            onInput={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            value={state.currentColor || '#ffffff'}
            title='글자 색상'
            id='textColor'
          />
          <label htmlFor='textColor' className={styles.colorLabel}>
            가
          </label>
        </div>

        {/* 배경 색상 선택 */}
        <div className={styles.colorPickerWrapper}>
          <input
            type='color'
            onInput={(e) =>
              editor
                .chain()
                .focus()
                .setHighlight({ color: e.target.value })
                .run()
            }
            value={editor.getAttributes('highlight').color || '#ffffff'}
            title='배경 색상'
            id='highlightColor'
          />
          <label htmlFor='highlightColor' className={styles.colorLabel}>
            배경
          </label>
        </div>

        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className={styles.btn}
          title='배경색 제거'
        >
          배경색 제거
        </button>
      </div>

      {/* 4. 정렬 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${styles.btn} ${state.alignLeft ? styles.active : ''}`}
        >
          왼쪽
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${styles.btn} ${state.alignCenter ? styles.active : ''}`}
        >
          가운데
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${styles.btn} ${state.alignRight ? styles.active : ''}`}
        >
          오른쪽
        </button>
      </div>

      {/* 5. 목록 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.btn} ${state.isBulletList ? styles.active : ''}`}
        >
          • 목록
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.btn} ${state.isOrderedList ? styles.active : ''}`}
        >
          1. 목록
        </button>
      </div>
    </div>
  );
}
