export const REPORT_PLACEHOLDERS = {
  post: {
    dropdown: '신고할 카테고리를 선택해주세요',
    title: '게시글 신고 제목을 입력해주세요',
    content: '상세 내용을 입력해주세요',
  },
  comment: {
    dropdown: '신고할 카테고리를 선택해주세요',
    title: '댓글 제목을 입력해주세요',
    content: '상세 내용을 입력해주세요',
  },
  user: {
    dropdown: '신고할 카테고리를 선택해주세요',
    title: '유저 신고 제목을 입력해주세요',
    content: '상세 내용을 입력해주세요',
  },
  exam: {
    dropdown: '신고할 카테고리를 선택해주세요',
    title: '시험후기 신고 제목을 입력해주세요',
    content: '상세 내용을 입력해주세요',
  },
} as const;

export const REPORT_STATUS_MAP = {
  PENDING: { label: '답변 전', variant: 'grey' },
  COMPLETED: { label: '답변 완료', variant: 'gradient' },
} as const;

export const REPORT_TYPE_TAG = {
  post: '게시글',
  exam: '시험후기',
  comment: '댓글',
  user: '유저',
} as const;

export const REPORT_TYPE_MAP = {
  POST_REPORT: 'post',
  EXAM_REVIEW_REPORT: 'exam',
  COMMENT_REPORT: 'comment',
  USER_REPORT: 'user',
} as const;
