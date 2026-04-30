import type { Attachment } from '@/feature/attachment/types';

import { putFileInBucket } from '@/apis';
import { authAxios } from '@/axios';

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

export const readInquiry = async (postId: string) => {
  const response = await authAxios.get(`/v1/inquiries/inquiry/${postId}`);

  return response.data.result;
};

export const deleteInquiry = async (postId: string) => {
  try {
    const response = await authAxios.delete(`/v1/inquiries/inquiry/${postId}`);

    return response.data.result;
  } catch (error) {
    const response = error?.response;

    if (!response) {
      throw new Error('네트워크 통신 중 오류가 발생했어요');
    }

    switch (response.status) {
      case 404:
        if (response.data.code === 6101) {
          throw new Error('존재하지 않는 게시글이에요');
        } else if (response.data.code === 6102) {
          throw new Error('답변 완료된 글은 삭제할 수 없어요');
        }
        break;
      default:
        throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};
