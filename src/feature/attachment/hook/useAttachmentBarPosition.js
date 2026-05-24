import { useEffect, useRef } from 'react';

const IOS_KEYBOARD_TOOLBAR = 55; // iOS Safari: 키보드 액세서리 바 보정값
const VV_EVENTS = ['resize', 'scroll'];
const DOC_EVENTS = ['focusin', 'focusout'];

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isAndroid = () => /Android/i.test(navigator.userAgent);

// iOS Chrome(CriOS)은 Safari와 달리 키보드 위에 자체 toolbar(뒤로/앞으로/완료)가 떠서 바를 가린다.
const isIOSChrome = () => isIOS() && /CriOS/.test(navigator.userAgent);

// 액세서리 바/toolbar는 편집 가능한 요소(input/textarea/contentEditable) 포커스 시에만 뜬다.
const isEditableFocused = () => {
  const el = document.activeElement;
  return (
    !!el &&
    (el.isContentEditable ||
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA')
  );
};

// iOS Safari: visualViewport에 액세서리 바가 포함되지 않아 생기는 간격만큼 내려준다.
const computeIOSOffset = (vv) => {
  const toolbar = isEditableFocused() ? IOS_KEYBOARD_TOOLBAR : 0;
  return Math.max(0, window.innerHeight - vv.height - toolbar);
};

// iOS Chrome: Safari의 액세서리 바 보정(-IOS_KEYBOARD_TOOLBAR) 없이 키보드 바로 위에 붙는다.
const computeIOSChromeOffset = (vv) =>
  Math.max(0, window.innerHeight - vv.height);

const computeAndroidOffset = (vv) => {
  const keyboardHeight = window.innerHeight - vv.height;
  return keyboardHeight > 0 ? Math.max(0, keyboardHeight - vv.offsetTop) : 0;
};

export function useAttachmentBarPosition() {
  const attachmentBarRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const computeOffset = isIOSChrome()
      ? computeIOSChromeOffset
      : isIOS()
        ? computeIOSOffset
        : isAndroid()
          ? computeAndroidOffset
          : null;
    if (!computeOffset) return;

    const bar = attachmentBarRef.current;

    const updatePosition = () => {
      if (!bar) return;
      bar.style.transform = `translateY(-${computeOffset(vv)}px)`;
    };

    const handler = () => requestAnimationFrame(updatePosition);
    VV_EVENTS.forEach((e) => vv.addEventListener(e, handler));
    DOC_EVENTS.forEach((e) => document.addEventListener(e, handler));
    updatePosition();

    return () => {
      VV_EVENTS.forEach((e) => vv.removeEventListener(e, handler));
      DOC_EVENTS.forEach((e) => document.removeEventListener(e, handler));
      if (bar) {
        bar.style.transform = '';
      }
    };
  }, []);

  return attachmentBarRef;
}
