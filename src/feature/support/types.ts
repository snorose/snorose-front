import { REPORT_OPTIONS } from '@/feature/support/data';

export type InquiryDTO = {
  postId: number;
  userRoleId: number;
  isWriter: boolean;
  userId: string;
  userDisplay: string;
  title: string;
  link: string;
  content: string;
  category:
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
  attachments: any[];
};

type ReportOptionType = typeof REPORT_OPTIONS;

type PostType = {
  reportType: 'POST_REPORT';
  category: ReportOptionType['post'][number]['key'];
};

type ExamReviewType = {
  reportType: 'EXAM_REVIEW_REPORT';
  category: ReportOptionType['exam'][number]['key'];
};

type CommentType = {
  reportType: 'COMMENT_REPORT';
  category: ReportOptionType['comment'][number]['key'];
};

type UserType = {
  reportType: 'USER_REPORT';
  category: ReportOptionType['user'][number]['key'];
};

export type ReportDTO = {
  reportId: number;
  userRoleId: number;
  isWriter: boolean;
  userId: string;
  userDisplay: string;
  title: string;
  content: string;
  status: 'PENDING' | 'COMPLETED';
  commentCount: number;
  createdAt: string;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: any[];
} & (PostType | ExamReviewType | CommentType | UserType);
