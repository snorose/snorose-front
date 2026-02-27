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

export type ReportDTO = {
  reportId: number;
  userRoleId: number;
  isWriter: boolean;
  userId: number;
  userDisplay: string;
  title: string;
  content: string;
  reportType:
    | 'POST_REPORT'
    | 'EXAM_REVIEW_REPORT'
    | 'COMMENT_REPORT'
    | 'USER_REPORT';
  category: string;
  status: 'PENDING' | 'COMPLETED';
  commentCount: number;
  createdAt: string;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: any[];
};
