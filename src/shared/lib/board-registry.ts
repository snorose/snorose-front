interface Board {
  key: string;
  id: number;
  name: string;
  desc?: string;
}

const COMMUNITY = [
  {
    key: 'FIRST-SNOW',
    id: 21,
    name: '첫눈온방',
    desc: '새내기 전용 커뮤니티',
  },
  {
    key: 'LARGE-SNOW',
    id: 22,
    name: '함박눈방',
    desc: '눈송이 모두의 커뮤니티',
  },
  {
    key: 'PERMANENT-SNOW',
    id: 23,
    name: '만년설방',
    desc: '졸업생 전용 커뮤니티',
  },
] as const satisfies readonly Board[];

const OFFICIAL = [
  {
    key: 'STUDENT-COUNCIL',
    id: 60,
    name: '총학생회',
    desc: '총학생회 공지',
  },
  {
    key: 'GRADUATION-PREPARATION',
    id: 61,
    name: '졸업준비위원회',
    desc: '졸업준비위원회 공지',
  },
  {
    key: 'FINANCE-AUDIT',
    id: 62,
    name: '재정감사위원회',
    desc: '재정감사 보고',
  },
] as const satisfies readonly Board[];

const REVIEW = [
  {
    key: 'EXAM-REVIEW',
    id: 32,
    name: '시험후기',
    desc: '시험 정보를 조회할 수\n있는 게시판입니다.',
  },
] as const satisfies readonly Board[];

const SNOROSE = [
  {
    key: 'NOTICE',
    id: 12,
    name: '공지사항',
  },
  {
    key: 'SUPPORT',
    id: 13,
    name: '문의 및 신고',
  },
  {
    key: 'EVENT',
    id: 14,
    name: '스노로즈 이벤트',
    desc: '스노로즈 이벤트 게시판',
  },
  {
    key: 'BESOOKT',
    id: 20,
    name: '베숙트',
    desc: '추천을 가장 많이\n받은 게시물 모아보기',
  },
] as const satisfies readonly Board[];

const ALL = [...COMMUNITY, ...OFFICIAL, ...REVIEW, ...SNOROSE] as const;

type BoardId = (typeof ALL)[number]['id'];
export type BoardKey = (typeof ALL)[number]['key'];

export const BOARD_REGISTRY = {
  communities: COMMUNITY,
  officials: OFFICIAL,
  all: ALL,

  find(identifier: BoardId | BoardKey): Board {
    if (typeof identifier === 'number') {
      return ALL.find(({ id }) => id === identifier);
    }

    return ALL.find(({ key }) => key === identifier);
  },
} as const;
