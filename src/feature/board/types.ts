export type InquiryDTO = {
  postId: number;
  userRoleId: number;
  isWriter: boolean;
  userId: string;
  userDisplay: string;
  title: string;
  link: string;
  content: string;
  category: 'EXAM_REVIEW_INQUIRY';
  status: 'PENDING';
  commentCount: number;
  createdAt: string;
  updatedAt: string | null;
  isEdited: boolean;
  isWriterWithdrawn: boolean;
  attachments: any[];
};
