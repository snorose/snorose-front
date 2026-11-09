import { Attachment } from '@/feature/attachment/types';

export type InquiryReadResponse = {
  inquiryId: number;
  userRoleId: number;
  isWriter: false;
  encryptedUserId: string;
  userDisplay: string;
  title: string;
  content: string;
  category: string;
  group: 'INQUIRY';
  subGroup:
    | 'EXAM_REVIEW_INQUIRY'
    | 'EVENT_INQUIRY'
    | 'NOTICE_INQUIRY'
    | 'ETC_INQUIRY';
  status: 'PENDING' | 'COMPLETED';
  commentCount: number;
  createdAt: string;
  updatedAt: string | null;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: Attachment[];
};

export type ReportReadResponse = {
  reportId: number;
  userRoleId: number;
  isWriter: boolean;
  encryptedUserId: string;
  userDisplay: string;
  title: string;
  content: string;
  category: string;
  group: 'REPORT';
  subGroup:
    | 'POST_REPORT'
    | 'EXAM_REVIEW_REPORT'
    | 'COMMENT_REPORT'
    | 'USER_REPORT';
  reportCause: string;
  status: 'PENDING' | 'COMPLETED' | 'WITHDRAWN';
  target: string;
  targetPostId: number;
  targetBoardId: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string | null;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: Attachment[];
};
