const post = [
  { key: 'POST_INSULT_OR_DEFAMATION', label: '특정인에 대한 욕설 및 비하' },
  { key: 'POST_COMMERCIAL_ADVERTISEMENT', label: '상업적 광고 및 판매글' },
  { key: 'POST_ILLEGAL_CONTENT', label: '불법촬영물 등을 유통' },
  { key: 'POST_PERSONAL_DATA_LEAK', label: '개인정보 유출' },
  { key: 'POST_AGITATION_OR_DISPUTE', label: '선동 및 분란 유발' },
  { key: 'POST_OBSCENE_OR_IMMORAL', label: '음란물/불건전한 만남 및 대화' },
  { key: 'POST_LOW_QUALITY', label: '무성의한 게시' },
  { key: 'POST_OFFENSIVE_CONTENT', label: '타인에게 혐오감을 주는 게시물' },
  { key: 'POST_ETC', label: '기타' },
] as const;

const exam = [
  { key: 'EXAM_FALSE_REVIEW', label: '허위 족보' },
  { key: 'EXAM_COMMERCIAL_SELLING', label: '상업적 판매' },
  { key: 'EXAM_ETC', label: '기타' },
] as const;

const comment = [
  { key: 'COMMENT_INSULT_OR_DEFAMATION', label: '특정인에 대한 욕설 및 비하' },
  { key: 'COMMENT_COMMERCIAL_ADVERTISEMENT', label: '상업적 광고 및 판매글' },
  { key: 'COMMENT_ILLEGAL_CONTENT', label: '불법촬영물 등의 유통' },
  { key: 'COMMENT_PERSONAL_DATA_LEAK', label: '개인정보 유출' },
  { key: 'COMMENT_OBSCENE_OR_IMMORAL', label: '음란물/불건전한 만남 및 대화' },
  { key: 'COMMENT_LOW_QUALITY', label: '스팸/무성의한 댓글' },
  { key: 'COMMENT_ETC', label: '기타' },
] as const;

const user = [
  { key: 'USER_IMPERSONATION', label: '타인 사칭' },
  { key: 'USER_FRAUD', label: '사기' },
  { key: 'USER_OUTSIDER', label: '외부인' },
  { key: 'USER_HARASSMENT', label: '괴롭힘/사이버폭력' },
  { key: 'USER_ETC', label: '기타' },
] as const;

export const REPORT_OPTION = {
  post,
  exam,
  comment,
  user,
} as const;
