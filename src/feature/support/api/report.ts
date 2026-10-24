import { Attachment } from '@/feature/attachment/types';

import { putFileInBucket } from '@/apis';
import { authAxios } from '@/axios';

export type ReportCreateRequest = {
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
}: ReportCreateRequest) => {
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

  return { postId };
};

export const readReport = async (postId: string) => {
  const response = await authAxios.get(`/v1/reports/report/${postId}`);

  return response.data.result;
};
