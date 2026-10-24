import calendarImage from '../component/PopUp/calendar.png';
import eventImage from '../component/PopUp/event.png';
import { addDateDays, getKstDate } from '../lib/popups';

// 사용자용 조회 API 확인 전 사용하는 데이터다. 관리자 상세 응답의 필드를 따른다.
export function createMockPopups() {
  const today = getKstDate();
  const create = (
    id,
    title,
    displayOrder,
    startOffset,
    endOffset,
    description,
    imageUrl
  ) => {
    const startDate = addDateDays(today, startOffset);
    const endDate = addDateDays(today, endOffset);
    return {
      id,
      title,
      displayOrder,
      description,
      imageUrl,
      startDate,
      endDate,
      status:
        today < startDate ? 'SCHEDULED' : today > endDate ? 'ENDED' : 'ACTIVE',
      createdAt: `${addDateDays(today, -7)}T10:00:00`,
      updatedAt: null,
    };
  };
  return [
    create(2, '[캘린더] 스노로즈 주요 일정', 1, -1, 5, null, calendarImage),
    create(
      1,
      '[공지] 스노로즈 소식',
      0,
      -2,
      7,
      '**스노로즈 공지를 확인해 주세요.**\n\n- 게시 기간에만 표시되는 팝업입니다.\n- 관리자에서 등록한 순서로 표시됩니다.\n\n[공지 게시판 보기](/board/notice)\n\n[스노로즈 인스타그램](https://www.instagram.com/snorose1906/)',
      null
    ),
    create(
      3,
      '[이벤트] 커뮤니티 이벤트 안내',
      2,
      2,
      7,
      '예약된 팝업은 시작일부터 표시됩니다.',
      eventImage
    ),
    create(
      4,
      '[종료] 지난 운영 안내',
      3,
      -7,
      -1,
      '종료된 팝업은 표시하지 않습니다.',
      null
    ),
  ];
}
