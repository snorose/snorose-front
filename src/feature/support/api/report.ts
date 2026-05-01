import { Attachment } from '@/feature/attachment/types';

import { putFileInBucket } from '@/apis';
import { authAxios } from '@/axios';

export type ReportCreateRequest = {
  targetId: string;
  title: string;
  content: string;
  reportCategory: string;
  reportType: string;
  attachments: (Attachment & { file: File })[];
};

export const createReport = async ({
  targetId,
  title,
  content,
  reportCategory,
  reportType,
  attachments,
}: ReportCreateRequest) => {
  try {
    const response = await authAxios.post('/v1/reports/report', {
      targetId,
      title,
      content,
      reportCategory,
      reportType,
      attachments: attachments.map(({ fileName, fileComment, type }) => ({
        fileName,
        fileComment,
        type,
      })),
    });

    const { reportId, attachmentUrlList } = response.data.result;

    if (attachmentUrlList.length > 0) {
      await putFileInBucket(
        attachmentUrlList,
        attachments.map(({ file }) => file)
      );
    }

    return { postId: reportId };
  } catch (error) {
    const response = error?.response;

    if (!response) {
      throw new Error('네트워크 통신 중 오류가 발생했어요');
    }

    switch (response.data.code) {
      case 3032:
        throw new Error('첨부파일은 최대 3개까지 업로드할 수 있어요');
      case 6103:
        throw new Error('신고 대상이 잘못되었어요');
      case 2007:
        throw new Error('신고 작성 권한이 없어요');
      default:
        throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};

export const readReport = async (postId: string) => {
  const response = await authAxios.get(`/v1/reports/report/${postId}`);

  return response.data.result;
};

export type ReportUpdateRequest = {
  postId: string;
  title: string;
  content: string;
  reportCategory: string;
  oldAttachments?: Attachment[];
  newAttachments?: (Attachment & { file: File })[];
  deleteAttachments?: number[];
};

export const updateReport = async ({
  postId,
  title,
  content,
  reportCategory,
  oldAttachments = [],
  newAttachments = [],
  deleteAttachments = [],
}: ReportUpdateRequest) => {
  try {
    const response = await authAxios.patch(`/v1/reports/report/${postId}`, {
      title,
      content,
      reportCategory,
      finalAttachments: [
        ...oldAttachments.map(({ id, fileName, fileComment, type }) => ({
          id,
          fileName,
          fileComment,
          type,
        })),
        ...newAttachments.map(({ id, fileName, fileComment, type }) => ({
          id,
          fileName,
          fileComment,
          type,
        })),
      ],
      deleteAttachments,
    });

    const { reportId, attachmentUrlList } = response.data.result;

    if (attachmentUrlList.length > 0) {
      await putFileInBucket(
        attachmentUrlList,
        newAttachments.map(({ file }) => file)
      );
    }

    return { postId: reportId };
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
      case 3031:
        throw new Error('존재하지 않는 글이에요');
      default:
        throw new Error('잠시 후 다시 시도해주세요.');
    }
  }
};
