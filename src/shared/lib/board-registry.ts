interface Board {
  key: string;
  id: number;
  name: string;
  desc?: string;
}

const COMMUNITY = [
  {
    key: 'first-snow',
    id: 21,
    name: '첫눈온방',
    desc: '새내기 전용 커뮤니티',
  },
  {
    key: 'large-snow',
    id: 22,
    name: '함박눈방',
    desc: '눈송이 모두의 커뮤니티',
  },
  {
    key: 'permanent-snow',
    id: 23,
    name: '만년설방',
    desc: '졸업생 전용 커뮤니티',
  },
] as const satisfies readonly Board[];

const OFFICIAL = [
  {
    key: 'student-council',
    id: 60,
    name: '총학생회',
    desc: '총학생회 공지',
  },
  {
    key: 'graduation-preparation',
    id: 61,
    name: '졸업준비위원회',
    desc: '졸업준비위원회 공지',
  },
  {
    key: 'finance-audit',
    id: 62,
    name: '재정감사위원회',
    desc: '재정감사 보고',
  },
] as const satisfies readonly Board[];

const REVIEW = [
  {
    key: 'exam-review',
    id: 32,
    name: '시험후기',
    desc: '시험 정보를 조회할 수 있는 게시판입니다.',
  },
] as const satisfies readonly Board[];

const SNOROSE = [
  {
    key: 'notice',
    id: 12,
    name: '공지사항',
  },
  {
    key: 'support',
    id: 13,
    name: '문의 및 신고',
  },
  {
    key: 'event',
    id: 14,
    name: '이벤트',
    desc: '스노로즈 이벤트 게시판',
  },
  {
    key: 'besookt',
    id: 20,
    name: '베숙트',
    desc: '추천을 가장 많이 받은 게시물 모아보기',
  },
] as const satisfies readonly Board[];

const LIFE = [
  {
    key: 'residence',
    id: 41,
    name: '주거',
    desc: '학교 주변 자취 · 기숙사 정보 공유',
  },
  {
    key: 'sookplace',
    id: 43,
    name: '숙플레이스',
    desc: '눈송이 맛집 커뮤니티',
  },
] as const satisfies readonly Board[];

const CULTURE = [
  {
    key: 'video-content',
    id: 1001,
    name: '영상 컨텐츠',
    desc: '영상 컨텐츠 커뮤니티',
  },
  {
    key: 'anime-comics',
    id: 1002,
    name: '애니·만화·웹툰·웹소설',
    desc: '애니·만화·웹툰·웹소설 생활 커뮤니티',
  },
  {
    key: 'book',
    id: 1003,
    name: '책',
    desc: '독서 생활 커뮤니티',
  },
  {
    key: 'music',
    id: 1004,
    name: '음악',
    desc: '음악 생활 커뮤니티',
  },
  {
    key: 'performance',
    id: 1005,
    name: '공연',
    desc: '공연 관람·팬 활동 커뮤니티',
  },
  {
    key: 'exhibition',
    id: 1006,
    name: '전시',
    desc: '전시 관람·추천 커뮤니티',
  },
  {
    key: 'trip',
    id: 1007,
    name: '여행',
    desc: '여행 정보 공유 커뮤니티',
  },
  {
    key: 'cooking',
    id: 1008,
    name: '요리·레시피',
    desc: '요리·레시피 커뮤니티',
  },
  {
    key: 'sport',
    id: 1009,
    name: '스포츠·운동',
    desc: '스포츠·운동 커뮤니티',
  },
  {
    key: 'pet',
    id: 1010,
    name: '반려동물',
    desc: '반려동물 정보·일상 커뮤니티',
  },
  {
    key: 'health',
    id: 1011,
    name: '건강',
    desc: '건강 정보 공유 커뮤니티',
  },
  {
    key: 'beauty',
    id: 1013,
    name: '뷰티',
    desc: '뷰티 정보 공유 커뮤니티',
  },
  {
    key: 'game',
    id: 1014,
    name: '게임',
    desc: '게임 정보·소통 커뮤니티',
  },
  { key: 'finance', id: 1012, name: '금융', desc: '금융 정보 공유 커뮤니티' },
  {
    key: 'living',
    id: 1015,
    name: '리빙·소품',
    desc: '생활용품·소품 정보·후기 커뮤니티',
  },
  {
    key: 'women-studies',
    id: 1016,
    name: '여성학',
    desc: '여성학 정보·토론 커뮤니티',
  },
] as const satisfies readonly Board[];
const CAMPUS = [
  {
    key: 'club',
    id: 70,
    name: '동아리 이모저모',
    desc: '동아리 정보·활동 커뮤니티',
  },
  {
    key: 'study-abroad',
    id: 71,
    name: '교환학생·어학연수',
    desc: '교환학생·어학연수 정보 공유 커뮤니티',
  },
] as const satisfies readonly Board[];

const CAREER = [
  {
    key: 'certification',
    id: 54,
    name: '어학·자격증',
    desc: '어학·자격증 정보·공부 커뮤니티',
  },
] as const satisfies readonly Board[];

// 화면에서는 커뮤니티 대분류에 노출하지만, 홈 커뮤니티 카드에 섞이지 않도록 COMMUNITY와 분리한다
const PROMOTION = [
  {
    key: 'promotion',
    id: 25,
    name: '홍보게시판',
    desc: '홍보·소식 공유 커뮤니티',
  },
] as const satisfies readonly Board[];

const ALL = [
  ...COMMUNITY,
  ...OFFICIAL,
  ...REVIEW,
  ...SNOROSE,
  ...LIFE,
  ...CULTURE,
  ...CAMPUS,
  ...CAREER,
  ...PROMOTION,
] as const;

type BoardId = (typeof ALL)[number]['id'];
export type BoardKey = (typeof ALL)[number]['key'];

export const BOARD_REGISTRY = {
  communities: COMMUNITY,
  officials: OFFICIAL,
  life: LIFE,
  culture: CULTURE,
  all: ALL,

  find(identifier: BoardId | BoardKey): Board {
    const result =
      typeof identifier === 'number'
        ? ALL.find(({ id }) => id === identifier)
        : ALL.find(({ key }) => key === identifier);

    if (!result) {
      throw new Error(
        `[BoardRegistry] 존재하지 않는 게시판 식별자입니다. (identifier: ${identifier})`
      );
    }

    return result;
  },
} as const;
