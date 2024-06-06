
export interface Section {
  id: number;
  icon: string;
  name: string;
  description: string;
}

export const BOARDS: Section[] = [
  {
    id: 2,
    icon: 'campaign',
    name: '공지사항',
    description: ''
  },
  {
    id: 3,
    icon: 'cloud',
    name: '첫눈온방',
    description: '새내기 전용 게시판'
  },
  {
    id: 4,
    icon: 'cloudy_snowing',
    name: '함박눈방',
    description: '눈송이 모두가 이용하는 커뮤니티'
  },
  {
    id: 5,
    icon: 'sunny',
    name: '만년설방',
    description: '졸업생 전용 게시판'
  },
  {
    id: 6,
    icon: 'hotel_class',
    name: '베숙트',
    description: '추천을 많이 받은 게시물 모아보기'
  }
]