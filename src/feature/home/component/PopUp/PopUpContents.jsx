import styles from './PopUpContents.module.css';
import calendar from './calendar.png';

const POPUP_CONTENTS = [
  {
    title: '1월 스노로즈 일정',
    content: null,
    image: calendar,
    startDate: '2025-12-31',
    endDate: '2026-01-07',
  },
];

const POPUP_INFO_CONTENTS = [
  '스노로즈 인스타그램(@snorose1906)에서 월별 스노로즈 일정을 쉽게 확인할 수 있습니다.',
  '공식 문의 창구 [이메일(snorose1906@gmail.com), 카카오톡 1:1 문의] 이외의 문의는 받고 있지 않습니다. 공식 문의 창구 이외의 문의 글은 답변 없이 삭제될 수 있음을 알려드립니다.',
];

// 날짜 범위 내에 오늘이 있는지 확인
const isDateInRange = (today, startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return start <= today && today <= end;
};

// 유효한 컨텐츠 필터링 (날짜 기반)
export const getFilteredContents = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return POPUP_CONTENTS.filter((section) =>
    isDateInRange(today, section.startDate, section.endDate)
  );
};

export const PopUpContents = ({ filteredContents }) => {
  if (!filteredContents.length) {
    return null;
  }

  return (
    <div className={styles.popupSectionContainer}>
      {filteredContents.map((section) => (
        <div key={section.title} className={styles.popupSection}>
          {section.title && (
            <h3 className={styles.popupSectionTitle}>{section.title}</h3>
          )}

          {section.content && (
            <ul className={styles.popupSectionContentList}>
              {section.content.map((content) => (
                <li key={content} className={styles.popupSectionContent}>
                  {content}
                </li>
              ))}
            </ul>
          )}

          {section.image && (
            <img
              src={section.image}
              alt={section.title}
              className={styles.popupSectionImage}
            />
          )}
        </div>
      ))}

      {/* 유효한 컨텐츠가 있을 때만 표시 */}
      <div className={styles.popupSection}>
        <ul className={styles.popupSectionContentList}>
          {POPUP_INFO_CONTENTS.map((content) => (
            <li key={content} className={styles.popupInfoSectionContent}>
              {content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
