import { Link } from 'react-router-dom';

import geminiBanner from '@/assets/banners/gemini-banner.png';

import calendarImage from './calendar.png';
import eventImage from './event.png';
import newBoard from './newBoard.png';
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
    title: '[모집] 스노로즈 서비스 리뷰어를 모집합니다! 🔍',
    description:
      '기능을 직접 사용하고, 불편한 점과 개선 아이디어를 들려주실 리뷰어를 모집합니다!',
    contentList: [
      '모집 대상 및 인원: 스노로즈 정회원 10명',

      '모집 기간: ~ 11/14(토) 23:59 (조기 마감 가능)',
      '참여 보상: 최대 160포인트',
    ],
    link: [
      {
        title: '모집 공고 확인하기',
        url: '/board/notice/post/1932838',
        isExternal: false,
      },
      {
        title: '신청하기 (구글폼)',
        url: 'https://forms.gle/ad82ksUnj66tz2PZ9',
        isExternal: true,
      },
    ],
    startDate: '2026-11-09',
    endDate: '2026-11-13',
  },
  {
    title: '‼️D-day‼️ 스노로즈 서비스 리뷰어 모집 마감',
    description:
      '기능을 직접 사용하고, 불편한 점과 개선 아이디어를 들려주실 리뷰어를 모집합니다!',
    contentList: [
      '모집 대상 및 인원: 스노로즈 정회원 10명',

      '모집 기간: ~ 11/14(토) 23:59 (조기 마감 가능)',
      '참여 보상: 최대 160포인트',
    ],
    link: [
      {
        title: '모집 공고 확인하기',
        url: '/board/notice/post/1932838',
        isExternal: false,
      },
      {
        title: '신청하기 (구글폼)',
        url: 'https://forms.gle/ad82ksUnj66tz2PZ9',
        isExternal: true,
      },
    ],
    startDate: '2026-11-14',
    endDate: '2026-11-14',
  },
  {
    title: '❄️ [모집] 2027 스노로즈 백엔드 파트장 모집 ❄️',
    description:
      '숙명인을 위한 커뮤니티, 스노로즈에서 백엔드 파트장을 모집합니다!',
    contentList: ['지원 마감: 11/18(수) 23:59'],
    link: [
      {
        title: '백엔드 파트장 모집 공고 확인하기',
        url: 'https://snorose.notion.site/2027-40d7ef0aa3bf805b8f57e299578a4937',
        isExternal: true,
      },
      {
        title: '백엔드 파트장 지원하기 (구글폼)',
        url: 'https://forms.gle/ubEwuYxKv5FNsTtj8',
        isExternal: true,
      },
    ],
    startDate: '2026-11-04',
    endDate: '2026-11-17',
  },
  {
    title: '‼️D-day‼️ 2027 스노로즈 백엔드 파트장 모집 ❄️',
    description:
      '숙명인을 위한 커뮤니티, 스노로즈에서 백엔드 파트장을 모집합니다!',
    contentList: ['지원 마감: 11/18(수) 23:59'],
    link: [
      {
        title: '백엔드 파트장 모집 공고 확인하기',
        url: 'https://snorose.notion.site/2027-40d7ef0aa3bf805b8f57e299578a4937',
        isExternal: true,
      },
      {
        title: '백엔드 파트장 지원하기 (구글폼)',
        url: 'https://forms.gle/ubEwuYxKv5FNsTtj8',
        isExternal: true,
      },
    ],
    startDate: '2026-11-18',
    endDate: '2026-11-18',
  },
  {
    title: '[강연] 스노로즈 제2회 특별 초청강연 (윤혜지 작가)',
    description:
      '몰랑이 원작자이자 눈송이 리뉴얼을 맡은 동문 윤혜지 작가님의 이야기를 만나보세요!',
    contentList: [
      '일시: 11/18(수) 18:00 ~ 20:00',
      '장소: 숙명여대 제2캠퍼스 B107호 (젬마홀)',
      '신청 대상: 모든 숙명인 (재학·휴학·수료·졸업), 선착순 100명',
      '신청 기간: ~ 11/18(수) 17:00 (조기 마감 가능)',
      '입장료: 3,300원 (수수료 포함, 신청 후 환불·양도 불가)',
    ],
    link: [
      {
        title: '초청강연 공지 보기',
        url: '/board/notice/post/1932124',
        isExternal: false,
      },
      {
        title: '초청강연 신청하기',
        url: '/commerce/sales/2',
        isExternal: false,
      },
    ],
    startDate: '2026-11-04',
    endDate: '2026-11-17',
  },
  {
    title: '💙D-day💙 스노로즈 제2회 특별 초청강연 (윤혜지 작가)',
    description:
      '몰랑이 원작자이자 눈송이 리뉴얼을 맡은 동문 윤혜지 작가님의 이야기를 만나보세요!',
    contentList: [
      '일시: 11/18(수) 18:00 ~ 20:00',
      '장소: 숙명여대 제2캠퍼스 B107호 (젬마홀)',
      '신청 대상: 모든 숙명인 (재학·휴학·수료·졸업), 선착순 100명',
      '신청 기간: ~ 11/18(수) 17:00 (조기 마감 가능)',
      '입장료: 3,300원 (수수료 포함, 신청 후 환불·양도 불가)',
    ],
    link: [
      {
        title: '초청강연 공지 보기',
        url: '/board/notice/post/1932124',
        isExternal: false,
      },
      {
        title: '초청강연 신청하기',
        url: '/commerce/sales/2',
        isExternal: false,
      },
    ],
    startDate: '2026-11-18',
    endDate: '2026-11-18',
  },

  {
    title: '숙플레이스 및 주거 게시판 오픈 이벤트 안내',
    description:
      '숙플레이스와 주거 게시판 오픈을 기념해 후기 이벤트가 진행됩니다.',
    contentList: [
      '참여 기간: 2026년 9월 1일(화) ~ 9월 22일(화)',
      '참여 방법: 숙플레이스 또는 주거 게시판에 필수 해시태그와 조건에 맞춰 후기 작성',
      '보상: 조건 충족 참여자 전원 10 point, 우수 작성자 추가 20 point 지급',
    ],
    image: newBoard,
    link: [
      {
        title: '스노로즈 공지',
        url: '/board/notice/post/1915197',
        isExternal: false,
      },
    ],
    startDate: '2026-08-30',
    endDate: '2026-09-05',
  },

  {
    title: '[공지] 포인트 미지급 기간',
    contentList: ['일시: 2026/10/13(화) ~ 2026/10/26(월)'],
    startDate: '2026-10-07',
    endDate: '2026-10-14',
  },
  {
    title: '[공지] 시험후기 작성 기간 안내',
    contentList: ['일시: 2026/10/27(화) ~ 2026/11/02(월)'],
    startDate: '2026-10-22',
    endDate: '2026-10-29',
  },
  {
    title: '[캘린더] 11월 스노로즈 일정',
    image: calendarImage,
    startDate: '2026-10-28',
    endDate: '2026-11-10',
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
