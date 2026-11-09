import { Attachment } from '@/feature/attachment/types';
import { ReportReadResponse } from '@/feature/support/types';

import { putFileInBucket } from '@/apis';
import { authAxios } from '@/axios';

type ReportCreateRequest = {
  targetId: string;
  title: string;
  content: string;
  subGroup: string;
  reportCause: string;
  attachments: (Attachment & { file: File })[];
};

export const createReport = async ({
  targetId,
  title,
  content,
  subGroup,
  reportCause,
  attachments,
}: ReportCreateRequest): Promise<{ reportId: number }> => {
  const response = await authAxios.post('/v1/reports/report', {
    targetId,
    title,
    content,
    subGroup,
    reportCause,
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

  return { reportId: postId };
};

export const readReport = async (
  reportId: number
): Promise<ReportReadResponse> => {
  const response = await authAxios.get(`/v1/reports/report/${reportId}`);

  return response.data.result;
};

export const withdrawReport = async (
  reportId: number
): Promise<{ reportId: number }> => {
  const response = await authAxios.patch(
    `/v1/reports/report/withdraw/${reportId}`
  );

  const { postId } = response.data.result;

  return { reportId: postId };
};
