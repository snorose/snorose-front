import { useEffect, useRef } from 'react';

const IOS_KEYBOARD_TOOLBAR = 0; // iOS Safari: 키보드 액세서리 바 보정값
const VV_EVENTS = ['resize', 'scroll'];
const DOC_EVENTS = ['focusin', 'focusout'];

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isAndroid = () => /Android/i.test(navigator.userAgent);

// iOS Chrome(CriOS)은 Safari와 달리 키보드 위에 자체 toolbar(뒤로/앞으로/완료)가 떠서 바를 가린다.
const isIOSChrome = () => isIOS() && /CriOS/.test(navigator.userAgent);

// iOS 인앱 브라우저(네이버/카카오톡/인스타그램)도 키보드 위에 자체 InputAccessoryView(완료 등)가 떠서 바를 가린다.
const IOS_INAPP_BROWSER_PATTERNS = [
  /NAVER\(inapp/i,
  /KAKAOTALK/i,
  /Instagram/i,
];
const isIOSInAppBrowser = () =>
  isIOS() &&
  IOS_INAPP_BROWSER_PATTERNS.some((re) => re.test(navigator.userAgent));

// iOS PWA(홈 화면에 추가, standalone)도 Safari와 달리 키보드 위에 자체 InputAccessoryView가 떠서 바를 가린다.
const isIOSPWA = () =>
  isIOS() &&
  (navigator.standalone === true ||
    window.matchMedia?.('(display-mode: standalone)').matches === true);

// iOS Chrome / 인앱 브라우저 / PWA처럼 키보드 위에 자체 toolbar가 떠서 Safari식 보정이 필요 없는 환경.
const hasOwnKeyboardToolbar = () =>
  isIOSChrome() || isIOSInAppBrowser() || isIOSPWA();

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

// 레이아웃 뷰포트(position:fixed 기준) 바닥과 비주얼 뷰포트 바닥 사이의 간격.
// window.innerHeight는 Safari 주소창 배치(상단/하단)·스크롤 축소 상태에 따라 값이 흔들려
// 오프셋이 어긋나므로, 크롬 높이가 식에 들어가지 않는 clientHeight + vv.offsetTop으로 계산한다.
const layoutBottomGap = (vv) =>
  Math.max(
    0,
    document.documentElement.clientHeight - (vv.height + vv.offsetTop)
  );

// iOS Safari: visualViewport에 액세서리 바가 포함되지 않아 생기는 간격만큼 내려준다.
const computeIOSOffset = (vv) => {
  const toolbar = isEditableFocused() ? IOS_KEYBOARD_TOOLBAR : 0;
  return Math.max(0, layoutBottomGap(vv) - toolbar);
};

// iOS Chrome / 인앱 브라우저: Safari의 액세서리 바 보정(-IOS_KEYBOARD_TOOLBAR) 없이 키보드 바로 위에 붙는다.
const computeKeyboardTopOffset = (vv) => layoutBottomGap(vv);

const computeAndroidOffset = (vv) => layoutBottomGap(vv);

export function useAttachmentBarPosition() {
  const attachmentBarRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const computeOffset = hasOwnKeyboardToolbar()
      ? computeKeyboardTopOffset
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
