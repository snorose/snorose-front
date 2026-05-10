import { useEffect, useRef } from 'react';

const IOS_KEYBOARD_TOOLBAR = 44;
const VV_EVENTS = ['resize', 'scroll'];
const DOC_EVENTS = ['focusin', 'focusout'];

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isAndroid = () => /Android/i.test(navigator.userAgent);

const getIOSToolbarOffset = () => {
  const el = document.activeElement;
  if (!el || el.isContentEditable) return 0;
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    return IOS_KEYBOARD_TOOLBAR;
  }
  return 0;
};

const computeIOSOffset = (vv) =>
  Math.max(
    0,
    window.innerHeight - vv.height - vv.offsetTop - getIOSToolbarOffset()
  );

const computeAndroidOffset = (vv) => {
  const keyboardHeight = window.innerHeight - vv.height;
  return keyboardHeight > 0 ? keyboardHeight - vv.offsetTop : 0;
};

export function useAttachmentBarPosition() {
  const attachmentBarRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const computeOffset = isIOS()
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
