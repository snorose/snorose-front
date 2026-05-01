import { Attachment } from '@/feature/attachment/types';

export type InquiryDTO = {
  group: 'INQUIRY';
  postId: number;
  userRoleId: number;
  isWriter: boolean;
  encryptedUserId: string;
  userDisplay: string;
  title: string;
  link: string;
  content: string;
  inquiryCategory:
    | 'EXAM_REVIEW_INQUIRY'
    | 'EVENT_INQUIRY'
    | 'NOTICE_INQUIRY'
    | 'ETC_INQUIRY';
  status: 'PENDING' | 'COMPLETED';
  commentCount: number;
  createdAt: string;
  updatedAt: string | null;
  isNotice: boolean;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: Attachment[];
};

export type ReportDTO = {
  postId: number;
  userRoleId: number;
  isWriter: boolean;
  encryptedUserId: string;
  userDisplay: string;
  title: string;
  content: string;
  reportType: 'POST' | 'COMMENT' | 'EXAM' | 'USER';
  reportCategory: string;
  status: 'PENDING' | 'COMPLETED';
  commentCount: number;
  createdAt: string;
  updatedAt: string | null;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: Attachment[];
};
