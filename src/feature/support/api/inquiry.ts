import type { Attachment } from '@/feature/attachment/types';

import { putFileInBucket } from '@/apis';
import { authAxios } from '@/axios';

export const readInquiry = async (inquiryId: string) => {
  const response = await authAxios.get(`/v1/inquiries/inquiry/${inquiryId}`);

  return response.data.result;
};

export type InquiryCreateRequest = {
  title: string;
  content: string;
  inquiryCategory: string;
  target?: string;
  attachments?: (Attachment & { file: File })[];
};

export const createInquiry = async ({
  title,
  content,
  inquiryCategory,
  target,
  attachments = [],
}: InquiryCreateRequest) => {
  try {
    const response = await authAxios.post('/v1/inquiries/inquiry', {
      title,
      target,
      content,
      inquiryCategory,
      attachments: attachments.map(({ fileName, fileComment, type }) => ({
        fileName,
        fileComment,
        type,
      })),
    });

    const { postId, attachmentUrlList } = response.data.result;

    if (attachmentUrlList.length > 0) {
      await putFileInBucket(
        attachmentUrlList,
        attachments.map(({ file }) => file)
      );
    }

    return { postId };
  } catch (error) {
    const response = error?.response;

    if (!response) {
      throw new Error('네트워크 통신 중 오류가 발생했어요');
    }

    switch (response.status) {
      case 400:
        throw new Error('첨부파일은 최대 3개까지 업로드할 수 있어요');
      case 403:
        throw new Error('문의 작성 권한이 없어요');
      default:
        throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};

export type InquirUpdateRequest = {
  postId: string;
  title: string;
  content: string;
  inquiryCategory: string;
  targetUrl?: string;
  oldAttachments?: Attachment[];
  newAttachments?: (Attachment & { file: File })[];
  deleteAttachments?: number[];
};

export const updateInquiry = async ({
  postId,
  title,
  content,
  inquiryCategory,
  targetUrl,
  oldAttachments = [],
  newAttachments = [],
  deleteAttachments = [],
}: InquirUpdateRequest) => {
  try {
    const response = await authAxios.patch(`/v1/inquiries/inquiry/${postId}`, {
      title,
      content,
      inquiryCategory,
      targetUrl,
      finalAttachments: [...oldAttachments, ...newAttachments],
      deleteAttachments,
    });

    const { inquiryId, attachmentUrlList } = response.data.result;

    if (attachmentUrlList.length > 0) {
      await putFileInBucket(
        attachmentUrlList,
        newAttachments.map(({ file }) => file)
      );
    }

    return { postId: inquiryId };
  } catch (error) {
    const response = error?.response;

    if (!response) {
      throw new Error('네트워크 통신 중 오류가 발생했어요');
    }

    switch (response.data.code) {
      case 2007:
        throw new Error('수정 권한이 없어요');
      case 3032:
        throw new Error('첨부파일은 최대 3개까지 업로드할 수 있어요');
      case 6102:
        throw new Error('답변 완료된 글은 수정할 수 없어요');
      default:
        throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};
