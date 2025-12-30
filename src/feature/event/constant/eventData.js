export const EVENT_FORM_DATA = (eventType) => ({
  category: eventType,
  isNotice: false,
  title: '',
  content: '',
  host: '',
  place: '',
  startAt: '',
  endAt: '',
  announceAt: '',
  drawCount: '',
  link: '',
});

export const NOTICE_FORM_DATA = (boardId) => ({
  category: '',
  boardId: boardId,
  title: '',
  content: '',
  isNotice: true,
});

export const EVENT_TYPES = {
  공지사항: 'notice',
  '연극/뮤지컬': 'theater',
  영화: 'movie',
  기타: 'etc',
};
