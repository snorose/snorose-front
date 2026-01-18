import styles from './PopUpContents.module.css';
import accountingReport from './accountingReport.png';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} PopupLink
 * @property {string} title - 링크 텍스트
 * @property {string} url - 링크 URL
 */

/**
 * @typedef {Object} PopupContent
 * @property {string} title - 팝업 섹션 제목
 * @property {string | null} description - 팝업 섹션 설명
 * @property {string[] | null} contentList - 본문 내용 배열 (리스트 아이템)
 * @property {PopupLink[] | null} link - 링크 목록
 * @property {string | null} image - 이미지 경로
 * @property {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @property {string} endDate - 종료 날짜 (YYYY-MM-DD)
 */

/** @type {PopupContent[]} */
const POPUP_CONTENTS = [
  {
    title: '2025년 12월 회계 보고',
    description:
      '숙명 메일 계정으로 접속하시면 회계 내역을 확인하실 수 있습니다.',
    contentList: [
      // '내용',
      // '추가 모집 분야: 이벤트기획, 프론트엔드',
    ],
    link: [
      {
        title: '스노로즈 회계 장부 (Google Sheets)',
        url: 'https://docs.google.com/spreadsheets/d/1MzXAHemKqPwVj3PzPJch5cR5z49gFtzABPgJ_FVjCXM',
      },
      {
        title: '스노로즈 공지 바로가기',
        url: '/board/notice/post/1869660',
      },
    ],
    image: accountingReport,
    startDate: '2026-01-12',
    endDate: '2026-01-20',
  },
  // {
  //   title: '1월 스노로즈 일정',
  //   content: null,
  //   link: null,
  //   image: calendar,
  //   startDate: '2025-12-31',
  //   endDate: '2026-01-07',
  // },
];

/** @type {string[]} */
const POPUP_INFO_CONTENTS = [
  '스노로즈 인스타그램(@snorose1906)에서 월별 스노로즈 일정을 확인할 수 있습니다.',
  '공식 문의 창구 [이메일(snorose1906@gmail.com), 카카오톡 1:1 문의] 이외의 문의는 받고 있지 않습니다. 공식 문의 창구 이외의 문의 글은 답변 없이 삭제될 수 있음을 알려드립니다.',
];

// 한국 시간대 기준 오늘 날짜 객체 생성
const getTodayInKorea = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const koreaTime = new Date(utc + 9 * 3600000); // UTC+9
  koreaTime.setHours(0, 0, 0, 0);

  return koreaTime;
};

// 날짜 범위 내에 오늘이 있는지 확인
const isDateInRange = (today, startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);

  return start <= today && today <= end;
};

// 유효한 컨텐츠 필터링 (날짜 기반)
export const getFilteredContents = () => {
  const todayInKorea = getTodayInKorea();

  return POPUP_CONTENTS.filter((section) =>
    isDateInRange(todayInKorea, section.startDate, section.endDate)
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

          {section.description && (
            <p className={styles.popupSectionContent}>{section.description}</p>
          )}

          {(section.contentList || section.link) && (
            <ul
              className={`${styles.popupSectionContent} ${styles.popupSectionContentList}`}
            >
              {section.contentList?.map((content) => (
                <li key={content} className={styles.popupSectionListItem}>
                  {content}
                </li>
              ))}

              {section.link?.map((link) => (
                <li
                  key={link.title}
                  className={`${styles.popupSectionListItem} ${styles.popupSectionLink}`}
                >
                  <Link to={link.url}>{link.title}</Link>
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
