import { DateTime } from '@/shared/lib';

import { serializeEventContent } from '@/feature/event/lib/content';

import { authAxios } from '@/axios';

import { putFileInBucket } from './post';

const uploadEventFiles = async (
  response,
  attachmentsInfo,
  postId = response.data?.result?.postId
) => {
  const files = attachmentsInfo
    .filter(({ id }) => id === '' || id == null)
    .map(({ file }) => file);
  if (!files.length) return response;

  try {
    const urls = response.data?.result?.attachmentUrlList;
    if (
      !Array.isArray(urls) ||
      urls.length !== files.length ||
      urls.some((url) => typeof url !== 'string' || !url)
    ) {
      throw new Error('첨부파일 업로드 URL이 올바르지 않아요.');
    }
    await putFileInBucket(urls, files);
    return response;
  } catch (cause) {
    const error = new Error(
      '게시글은 저장됐지만 첨부파일 업로드에 실패했어요. 업로드 재시도를 눌러주세요.'
    );
    error.cause = cause;
    error.retryUpload = async () => {
      const current = await getEventContent(postId);
      const attachments = current.attachments;
      // 다른 편집으로 첨부 구성이 바뀌었다면 엉뚱한 파일을 삭제하지 않는다.
      if (
        attachments.length !== attachmentsInfo.length ||
        attachments.some((attachment, index) => {
          const original = attachmentsInfo[index];
          return original.id === '' || original.id == null
            ? attachment.fileName !== original.fileName ||
                attachment.type !== original.type
            : attachment.id !== original.id;
        })
      ) {
        throw new Error(
          '첨부파일 구성이 변경됐어요. 저장된 게시글의 수정 화면에서 다시 첨부해주세요.'
        );
      }

      // 만료된 URL을 재사용하지 않고, 이번에 추가한 첨부만 교체해 새 URL을 받는다.
      // 본문·날짜 등은 보내지 않아 서버에 저장된 값을 유지한다.
      const deleteAttachments = [];
      const finalAttachments = attachments.map((attachment, index) => {
        const { type, fileName, fileComment } = attachment;
        const original = attachmentsInfo[index];
        let id = attachment.id;
        if (original.id === '' || original.id == null) {
          deleteAttachments.push(id);
          id = null;
        }
        return { id, type, fileName, fileComment };
      });
      const renewedResponse = await authAxios.patch(`v1/events/${postId}`, {
        finalAttachments,
        deleteAttachments,
      });
      return uploadEventFiles(renewedResponse, attachmentsInfo, postId);
    };
    throw error;
  }
};

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
  const result = response?.data.result;
  return result ? { ...result, attachments: result.attachments ?? [] } : result;
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
  attachmentsInfo = [],
}) => {
  const nullDate = (date) => (date ? DateTime.format(date, 'ISO') : null);

  const data = {
    category: category,
    isNotice: isNotice,
    title: title,
    content: serializeEventContent(content),
    host: host,
    place: place,
    startAt: nullDate(startAt),
    endAt: nullDate(endAt),
    announceAt: nullDate(announceAt),
    drawCount: drawCount?.trim() || null,
    link: link?.trim() || null,
    attachments: attachmentsInfo.map(({ type, fileName, fileComment }) => ({
      type,
      fileName,
      fileComment,
    })),
  };

  const response = await authAxios.post(`/v1/events`, data);
  return uploadEventFiles(response, attachmentsInfo);
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
  attachmentsInfo,
  deleteAttachments = [],
}) => {
  const nullDate = (date) => (date ? DateTime.format(date, 'ISO') : null);

  if (!Array.isArray(attachmentsInfo)) {
    throw new Error('기존 첨부파일을 불러온 뒤 다시 수정해주세요.');
  }

  const editedEvent = {
    postId: postId,
    category: category,
    isNotice: isNotice,
    title: title,
    content: serializeEventContent(content),
    host: host,
    place: place,
    startAt: nullDate(startAt),
    endAt: nullDate(endAt),
    announceAt: nullDate(announceAt),
    drawCount: drawCount?.trim() || null,
    link: link?.trim() || null,
    finalAttachments: attachmentsInfo.map(
      ({ id, type, fileName, fileComment }) => ({
        id: id === '' || id == null ? null : id,
        type,
        fileName,
        fileComment,
      })
    ),
    deleteAttachments,
  };

  const response = await authAxios.patch(`v1/events/${postId}`, editedEvent);
  return uploadEventFiles(response, attachmentsInfo, postId);
};

// 이벤트 게시글 삭제
export const deleteEvent = async (postId) => {
  const response = await authAxios.delete(`/v1/events/${postId}`);
  return response;
};
