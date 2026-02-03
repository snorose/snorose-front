const post = [
  { key: 'POST_PERSONAL_ABUSE', label: '특정인에 대한 욕설 및 비하' },
  { key: 'POST_COMMERCIAL_AD', label: '상업적 광고 및 판매글' },
  { key: 'POST_ILLEGAL_DISTRIBUTION', label: '불법촬영물 등을 유통' },
  { key: 'POST_PRIVACY_VIOLATION', label: '개인정보 유출' },
  { key: 'POST_INCITEMENT_DIVISION', label: '선동 및 분란 유발' },
  { key: 'POST_ADULT_CONTENT', label: '음란물/불건전한 만남 및 대화' },
  { key: 'POST_INSINCERE_CONTENT', label: '무성의한 게시' },
  { key: 'POST_HATEFUL_CONTENT', label: '타인에게 혐오감을 주는 게시물' },
];

const comment = [
  { key: 'COMMENT_PERSONAL_ABUSE', label: '특정인에 대한 욕설 및 비하' },
  { key: 'COMMENT_COMMERCIAL_AD', label: '상업적 광고 및 판매 댓글이에요' },
  { key: 'COMMENT_PRIVACY_VIOLATION', label: '개인정보 유출' },
  { key: 'COMMENT_INCITEMENT_DIVISION', label: '선동 및 분란 유발' },
  { key: 'COMMENT_ADULT_CONTENT', label: '음란물/불건전한 만남 및 대화' },
  { key: 'COMMENT_SPAM', label: '스팸/무성의한 댓글' },
  { key: 'COMMENT_OTHER', label: '기타' },
];

const user = [
  { key: 'USER_IMPERSONATION', label: '타인 사칭' },
  { key: 'USER_FRAUD', label: '사기' },
  { key: 'USER_EXTERNAL_PARTY', label: '외부인' },
  { key: 'USER_HARASSMENT', label: '괴롭힘/사이버폭력' },
  { key: 'USER_OTHER', label: '기타' },
];

const exam = [
  { key: 'EXAM_FAKE_REVIEW', label: '허위 족보' },
  { key: 'EXAM_COMMERCIAL_SALE', label: '상업적 판매' },
  { key: 'EXAM_OTHER', label: '기타' },
];

export const REPORT_OPTION = {
  post,
  comment,
  user,
  exam,
} as const;
