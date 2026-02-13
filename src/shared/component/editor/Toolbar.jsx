import React, { useState, useRef, useEffect } from 'react';
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaListOl,
  FaImage, FaCommentDots, FaPalette, FaFillDrip 
} from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import styles from './Editor.module.css';

export default function Toolbar({ editor }) {

  // 색상 상태
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  // 팔레트 토글 상태
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  // 팔레트 참조
  const textColorRef = useRef(null);
  const bgColorRef = useRef(null);
  

  // 외부 클릭 시 팔레트 닫기
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

      {/* =================== 텍스트 서식 =================== */}
      <button onClick={() => editor.chain().focus().toggleBold().run()}><FaBold /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}><FaItalic /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}><FaUnderline /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}><FaStrikethrough /></button>

      {/* =================== 글자색 팔레트 =================== */}
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

      {/* =================== 배경색 팔레트 =================== */}
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
              style={{ marginTop: 4 }}
              onClick={() => {
                setBgColor('#ffffff');
                editor.chain().focus().setMark('textStyle', { backgroundColor: null }).run();
                setShowBgColor(false);
              }}
            >
              X
            </button>
          </div>
        )}
      </div>

      {/* =================== 폰트 선택 =================== */}
      <button onClick={() => editor.chain().focus().setMark('textStyle', { fontFamily: 'Arial' }).run()}>Arial</button>
      <button onClick={() => editor.chain().focus().setMark('textStyle', { fontFamily: 'Courier New' }).run()}>Courier</button>

      <div className={styles.divider} />

      {/* =================== 정렬 / 목록 =================== */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()}><FaAlignLeft /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}><FaAlignCenter /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()}><FaAlignRight /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}><FaListUl /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}><FaListOl /></button>

      <div className={styles.divider} />

      {/* =================== 그림 / 주석 =================== */}
      <button onClick={() => console.log('이미지 삽입 기능 구현 필요')}><FaImage /></button>
      <div className={styles.divider} />
      <button onClick={() => console.log('주석 기능 구현 필요')}><FaCommentDots /></button>

    </div>
  );
}
