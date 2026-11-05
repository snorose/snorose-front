import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LinkAlertModal from '@/shared/component/modal/LinkAlertModal/LinkAlertModal';
import { useAuth } from '@/shared/hook';
import { hashtagifyHtml, linkifyHtml } from '@/shared/lib';

import editorStyles from '@/feature/editor/component/EditorContainer/EditorContainer.module.css';
import { useIframeAutoResize } from '@/feature/editor/hook/useIframeAutoResize';
import { sanitizePostHtml } from '@/feature/editor/lib/sanitize';
import { eventContentToHtml } from '@/feature/event/lib/content';

export default function EventContent({ content }) {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [selectedLink, setSelectedLink] = useState('');
  const [checked, setChecked] = useState(false);
  const storageKey = userInfo?.loginId
    ? `hideLinkAlert_${userInfo.loginId}`
    : null;
  const html = useMemo(
    () =>
      sanitizePostHtml(
        hashtagifyHtml(linkifyHtml(eventContentToHtml(content)))
      ),
    [content]
  );
  useIframeAutoResize();

  const handleClick = (event) => {
    const hashtag = event.target.closest('[data-hashtag]');
    if (hashtag) {
      event.preventDefault();
      navigate(
        `/board/all/search?keyword=${encodeURIComponent(hashtag.dataset.hashtag)}`
      );
      return;
    }
    const anchor = event.target.closest('a');
    if (!anchor) return;
    event.preventDefault();
    const href = anchor.getAttribute('href');
    if (!href) return;
    if (storageKey && localStorage.getItem(storageKey) === 'true') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedLink(href);
    }
  };

  return (
    <>
      <div
        className={editorStyles.editor}
        aria-label='이벤트 상세 설명'
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <LinkAlertModal
        isOpen={Boolean(selectedLink)}
        onClose={() => setSelectedLink('')}
        onConfirm={() => {
          if (checked && storageKey) localStorage.setItem(storageKey, 'true');
          window.open(selectedLink, '_blank', 'noopener,noreferrer');
          setSelectedLink('');
        }}
        checked={checked}
        setChecked={setChecked}
      />
    </>
  );
}
