import { Link } from 'react-router-dom';

import calendarImage from './calendar.png';
import eventImage from './event.png';
import styles from './PopUpContents.module.css';

/**
 * @typedef {Object} PopupLink
 * @property {string} title - 링크 텍스트
 * @property {string} url - 링크 URL
 * @property {boolean} [isExternal=false] - 외부 링크 여부 (true면 새 탭, false면 SPA 내부 이동)
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
    title: '[EVENT] 스노로즈 X 웰라쥬 체험단 이벤트 🎁✨',
    description: '무너진 피부에 #속수분텐션업할 시간!',
    contentList: [
      '모집 인원: 스노로즈 가입자 중 숙명여대 재학생, 휴학생, 졸업생 포함 총 50인',
      '체험 제품: 웰라쥬 리얼 히알루로닉 수딩 크림 본품(80ml)',
      '모집 기간: 4월 27일(월) ~ 5월 4일(월)',
    ],
    link: [
      {
        title: '이벤트 관련 링크 (스노로즈 공지)',
        url: '/board/notice/post/1895414',
        isExternal: false,
      },
    ],
    image: eventImage,
    startDate: '2026-04-28',
    endDate: '2026-05-04',
  },
  {
    title: '[전시] 2026 Low-Code AI Challenge 수상작 🏆',
    description:
      '스노로즈와 Upstage가 공동 주최한 2026 Low-Code AI Challenge의 수상작을 공개합니다. 일상 속 다양한 문제를 Low-Code 기반 AI 자동화로 해결한 프로젝트들을 만나보세요.',
    link: [
      {
        title: '수상작 보러가기',
        url: 'https://2026-hackathon.snorose.com',
        isExternal: true,
      },
    ],
    startDate: '2026-06-01',
    endDate: '2026-06-10',
  },
  {
    title: '[블로그] 2026 새학기 이벤트 돌아보기',
    description:
      '새내기들의 캠퍼스 라이프를 응원하기 위해 진행한 ‘2026 새학기 이벤트’의 기록을 담았습니다.',
    link: [
      {
        title: '블로그 링크 (노션)',
        url: 'https://snorose.notion.site/2026-3167ef0aa3bf8057a749d2c6442a2422',
        isExternal: true,
      },
    ],
    startDate: '2026-05-31',
    endDate: '2026-06-10',
  },

  {
    title: '[캘린더] 6월 스노로즈 일정',
    image: calendarImage,
    startDate: '2026-05-31',
    endDate: '2026-06-10',
  },
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
  const startStr = startDate?.trim?.() ?? startDate;
  const endStr = endDate?.trim?.() ?? endDate;

  const start = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T23:59:59`);

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
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {link.title}
                    </a>
                  ) : (
                    <Link to={link.url}>{link.title}</Link>
                  )}
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
