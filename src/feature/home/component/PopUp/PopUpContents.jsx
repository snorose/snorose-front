import { useNavigate } from 'react-router-dom';

import { renderPopupMarkdown } from './markdown';
import styles from './PopUpContents.module.css';

const POPUP_INFO_CONTENTS = [
  '스노로즈 인스타그램(@snorose1906)에서 월별 스노로즈 일정을 확인할 수 있습니다.',
  '공식 문의 창구 [이메일(snorose1906@gmail.com), 카카오톡 1:1 문의] 이외의 문의는 받고 있지 않습니다. 공식 문의 창구 이외의 문의 글은 답변 없이 삭제될 수 있음을 알려드립니다.',
];

export const PopUpContents = ({ filteredContents }) => {
  const navigate = useNavigate();
  const handleLinkClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor = event.target.closest('a');
    if (
      !anchor ||
      anchor.target ||
      !anchor.hasAttribute('href') ||
      anchor.origin !== window.location.origin
    )
      return;
    event.preventDefault();
    navigate(`${anchor.pathname}${anchor.search}${anchor.hash}`);
  };
  if (!filteredContents.length) return null;

  return (
    <div className={styles.popupSectionContainer}>
      {filteredContents.map((section) => (
        <section key={section.id} className={styles.popupSection}>
          <h3 className={styles.popupSectionTitle}>{section.title}</h3>
          {section.description && (
            <div
              className={styles.popupSectionContent}
              onClick={handleLinkClick}
              dangerouslySetInnerHTML={{
                __html: renderPopupMarkdown(section.description),
              }}
            />
          )}
          {section.imageUrl && (
            <img
              src={section.imageUrl}
              alt={section.title}
              className={styles.popupSectionImage}
            />
          )}
        </section>
      ))}
      <div className={styles.popupSection}>
        <ul
          className={`${styles.popupSectionContentList} ${styles.popupSectionContent}`}
        >
          {POPUP_INFO_CONTENTS.map((content) => (
            <li
              key={content}
              className={`${styles.popupSectionListItem} ${styles.popupSectionInfo}`}
            >
              {content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
