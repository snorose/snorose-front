import React, { useState, useRef, useEffect } from 'react';
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaListOl,
  FaImage, FaCommentDots, FaPalette, FaFillDrip 
} from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import styles from './Editor.module.css';

export default function Toolbar({ editor }) {

  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  const textColorRef = useRef(null);
  const bgColorRef = useRef(null);

  const FONT_OPTIONS = [
    { value: 'Arial', label: 'Arial' },
    { value: "'Apple SD Gothic Neo', '애플 SD 고딕 Neo'", label: 'Apple SD Gothic Neo' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Verdana', label: 'Verdana' },
    { value: "'Malgun Gothic', '맑은 고딕'", label: '맑은 고딕' },
    { value: "'Nanum Gothic', '나눔고딕'", label: '나눔고딕' },
  ];
  
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


  if (!editor) return null;

  return (
    <div className={styles.toolbar}>

      <button aria-label="굵게" onClick={() => editor.chain().focus().toggleBold().run()}><FaBold /></button>
      <button aria-label="기울임체"  onClick={() => editor.chain().focus().toggleItalic().run()}><FaItalic /></button>
      <button aria label="밑줄" onClick={() => editor.chain().focus().toggleUnderline().run()}><FaUnderline /></button>
      <button aria-label="취소선" onClick={() => editor.chain().focus().toggleStrike().run()}><FaStrikethrough /></button>

      <div ref={textColorRef} className={styles.colorPickerWrapper}>
        <button onClick={() => setShowTextColor(prev => !prev)}><FaPalette /></button>
        {showTextColor && (
            <div className={styles.colorPickerPopup}>
            <ChromePicker
                color={textColor}
                onChange={color => {
                setTextColor(color.hex);
                editor.chain().focus().setMark('textStyle', { color: color.hex }).run();
                }}
                disableAlpha
            />
            </div>
        )}
        </div>

      {/* 배경색 팔레트 */}
      <div ref={bgColorRef} className={styles.bgColorWrapper}>
      <button onClick={() => setShowBgColor(prev => !prev)}><FaFillDrip /></button>
      {showBgColor && (
        <div className={styles.bgColorPopup}>
        <ChromePicker
            color={bgColor}
            onChange={color => {
            setBgColor(color.hex);
            editor.chain().focus().setMark('textStyle', { backgroundColor: color.hex }).run();
            }}
            disableAlpha
        />
        <button
            className={styles.cancelButton}
            onClick={() => {
            setBgColor('#ffffff');
            editor.chain().focus().setMark('textStyle', { backgroundColor: null }).run();
            setShowBgColor(false);
            }}
        >
            배경색 취소
        </button>
        </div>
        )}
      </div>


      <select
        onChange={e => {
            const font = e.target.value;
            editor.chain().focus().setMark('textStyle', { fontFamily: font }).run();
        }}
        defaultValue="default"
        className={styles.fontSelect}
        >
        <option value="default" disabled>폰트 선택</option>
        {FONT_OPTIONS.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
        ))}
      </select>


      <div className={styles.divider} />

      <button aria-label="왼쪽 정렬" onClick={() => editor.chain().focus().setTextAlign('left').run()}><FaAlignLeft /></button>
      <button aria-label="가운데 정렬" onClick={() => editor.chain().focus().setTextAlign('center').run()}><FaAlignCenter /></button>
      <button aria-label="오른쪽 정렬" onClick={() => editor.chain().focus().setTextAlign('right').run()}><FaAlignRight /></button>
      <button aria-label="토글 정렬" onClick={() => editor.chain().focus().toggleBulletList().run()}><FaListUl /></button>
      <button aria-label="순서 정렬" onClick={() => editor.chain().focus().toggleOrderedList().run()}><FaListOl /></button>

      <div className={styles.divider} />

      {/*  
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
      */}
      {/*
      <div className={styles.divider} />
      <button onClick={() => console.log('주석 기능 구현 필요')}><FaCommentDots /></button> */}
    </div>
  );
}
