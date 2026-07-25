import { useEffect, useRef } from 'react';

const VV_EVENTS = ['resize', 'scroll'];
const DOC_EVENTS = ['focusin', 'focusout'];

const layoutBottomGap = (vv) =>
  Math.max(
    0,
    document.documentElement.clientHeight - (vv.height + vv.offsetTop)
  );

export function useAttachmentBarPosition() {
  const attachmentBarRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const bar = attachmentBarRef.current;

    const updatePosition = () => {
      if (!bar) return;
      bar.style.transform = `translateY(-${layoutBottomGap(vv)}px)`;
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
