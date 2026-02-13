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
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textColorRef.current && !textColorRef.current.contains(event.target)) {
        setShowTextColor(false);
      }
      if (bgColorRef.current && !bgColorRef.current.contains(event.target)) {
        setShowBgColor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  return (
    <div className={styles.toolbar}>

      <button onClick={() => editor.chain().focus().toggleBold().run()}><FaBold /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}><FaItalic /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}><FaUnderline /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}><FaStrikethrough /></button>

      <div ref={textColorRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={() => setShowTextColor(prev => !prev)}><FaPalette /></button>
        {showTextColor && (
          <div style={{ position: 'absolute', zIndex: 10, top: '100%' }}>
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
      <div ref={bgColorRef} style={{ position: 'relative', display: 'inline-block', marginLeft: 8 }}>
        <button onClick={() => setShowBgColor(prev => !prev)}><FaFillDrip /></button>
        {showBgColor && (
          <div style={{ position: 'absolute', zIndex: 10, top: '100%' }}>
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

      {/* 폰트 선택 드롭다운 */}
      <select
        onChange={e => {
          const font = e.target.value;
          editor.chain().focus().setMark('textStyle', { fontFamily: font }).run();
        }}
        defaultValue="default"
        style={{ marginLeft: 8 }}
      >
        <option value="default" disabled>폰트 선택</option>
        <option value="Arial">Arial</option>
        <option value="'Apple SD Gothic Neo', '애플 SD 고딕 Neo'">Apple SD Gothic Neo</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
        <option value="'Malgun Gothic', '맑은 고딕'">맑은 고딕</option>
        <option value="'Nanum Gothic', '나눔고딕'">나눔고딕</option>
      </select>

      <div className={styles.divider} />

      <button onClick={() => editor.chain().focus().setTextAlign('left').run()}><FaAlignLeft /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}><FaAlignCenter /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()}><FaAlignRight /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}><FaListUl /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}><FaListOl /></button>

      <div className={styles.divider} />

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
