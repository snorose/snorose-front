import type { Attachment } from '@/feature/attachment/types';
import { isMaintenanceBlockedError } from '@/feature/maintenance/access';
import { InquiryReadResponse } from '@/feature/support/types';

import { putFileInBucket } from '@/apis';
import { authAxios } from '@/axios';

type InquiryCreateRequest = {
  title: string;
  content: string;
  subGroup: string;
  attachments?: (Attachment & { file: File })[];
};

export const createInquiry = async ({
  title,
  content,
  subGroup,
  attachments = [],
}: InquiryCreateRequest): Promise<{ inquiryId: number }> => {
  try {
    const response = await authAxios.post('/v1/inquiries/inquiry', {
      title,
      content,
      subGroup,
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

    return { inquiryId: postId };
  } catch (error) {
    if (isMaintenanceBlockedError(error)) throw error;
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

export const readInquiry = async (
  inquiryId: number
): Promise<InquiryReadResponse> => {
  const response = await authAxios.get(`/v1/inquiries/inquiry/${inquiryId}`);

  return response.data.result;
};

type InquiryUpdateRequest = {
  inquiryId: number;
  title: string;
  content: string;
  subGroup: string;
  oldAttachments?: Attachment[];
  newAttachments?: (Attachment & { file: File })[];
  deleteAttachments?: number[];
};

export const updateInquiry = async ({
  inquiryId,
  title,
  content,
  subGroup,
  oldAttachments = [],
  newAttachments = [],
  deleteAttachments = [],
}: InquiryUpdateRequest): Promise<{ inquiryId: number }> => {
  try {
    const response = await authAxios.patch(
      `/v1/inquiries/inquiry/${inquiryId}`,
      {
        title,
        content,
        subGroup,
        finalAttachments: [...oldAttachments, ...newAttachments].map(
          ({ id, fileName, fileComment, type }) => ({
            id,
            fileName,
            fileComment,
            type,
          })
        ),
        deleteAttachments,
      }
    );

    const { postId, attachmentUrlList } = response.data.result;

    if (attachmentUrlList.length > 0) {
      await putFileInBucket(
        attachmentUrlList,
        newAttachments.map(({ file }) => file)
      );
    }

    return { inquiryId: postId };
  } catch (error) {
    if (isMaintenanceBlockedError(error)) throw error;
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

export const deleteInquiry = async (
  inquiryId: string
): Promise<{ inquiryId: number }> => {
  try {
    const response = await authAxios.delete(
      `/v1/inquiries/inquiry/${inquiryId}`
    );

    const { postId } = response.data.result;

    return { inquiryId: postId };
  } catch (error) {
    if (isMaintenanceBlockedError(error)) throw error;
    const response = error?.response;

    if (!response) {
      throw new Error('네트워크 통신 중 오류가 발생했어요');
    }

    switch (response.data.code) {
      case 6101:
        throw new Error('존재하지 않는 게시글이에요');
      case 6102:
        throw new Error('답변 완료된 글은 삭제할 수 없어요');
      default:
        throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};
