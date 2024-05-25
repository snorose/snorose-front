
export interface Section {
  name: string;
  boardId: number;
}

export const announcements: Section[] = [
  {
    name: '명예의 전당',
    boardId: -1
  },
  {
    name: '공지사항',
    boardId: 2
  },
];

export const communityList: Section[] = [
  {
    name: '함박눈방',
    boardId: 4
  },
  {
    name: '첫눈온방',
    boardId: 3
  },
  {
    name: '만년설방',
    boardId: 5
  }
];

export const departmentList: Section[] = [
  {
    name: '소프트웨어학부',
    boardId: -1
  },
  {
    name: '문과대학',
    boardId: -1
  },
  {
    name: '이과대학',
    boardId: -1
  },
  {
    name: '공과대학',
    boardId: -1
  },
  {
    name: '미술대학',
    boardId: -1
  },
  {
    name: '음악대학',
    boardId: -1
  },
]