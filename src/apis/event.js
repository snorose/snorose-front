import { authAxios } from '@/axios';
import { DateTime } from '@/shared/lib';

// 이벤트 게시글 목록 조회
export const getEventPosts = async ({ page, progressType }) => {
  const response = await authAxios.get('/v1/events', {
    params: {
      page,
      progressType,
    },
  });

  return response?.data.result;
};

// 이벤트 게시글 상세조회
export const getEventContent = async (postId) => {
  const response = await authAxios.get(`v1/events/${postId}`);
  return response?.data.result;
};

// 이벤트 게시글 등록
export const postEvent = async ({
  category,
  isNotice,
  title,
  content,
  host,
  place,
  startAt,
  endAt,
  announceAt,
  drawCount,
  link,
}) => {
  const nullDate = (date) => (date ? DateTime.format(date, 'ISO') : null);

  const data = {
    category: category,
    isNotice: isNotice,
    title: title,
    content: content,
    host: host,
    place: place,
    startAt: nullDate(startAt),
    endAt: nullDate(endAt),
    announceAt: nullDate(announceAt),
    drawCount: drawCount,
    link: link,
  };

  const response = await authAxios.post(`/v1/events`, data);
  return response;
};

// 이벤트 리스트 조회는 post.js에 포함되어 있습니다.

// 이벤트 게시글 수정
export const patchEvent = async ({
  postId,
  category,
  isNotice,
  title,
  content,
  host,
  place,
  startAt,
  endAt,
  announceAt,
  drawCount,
  link,
}) => {
  const nullDate = (date) => (date ? DateTime.format(date, 'ISO') : null);

  const editedEvent = {
    postId: postId,
    category: category,
    isNotice: isNotice,
    title: title,
    content: content,
    host: host,
    place: place,
    startAt: nullDate(startAt),
    endAt: nullDate(endAt),
    announceAt: nullDate(announceAt),
    drawCount: drawCount,
    link: link,
  };

  const response = await authAxios.patch(`v1/events/${postId}`, editedEvent);
  return response;
};

// 이벤트 게시글 삭제
export const deleteEvent = async (postId) => {
  const response = await authAxios.delete(`/v1/events/${postId}`);
  return response;
};
