import PostBar from './PostBar';

const meta = {
  title: 'Feature/Board/PostBar',
  component: PostBar,
  parameters: {
    docs: {
      description: {
        component:
          'PostBar 컴포넌트는 게시판에서 게시글 목록을 표시할 때 사용하는 카드 형태의 컴포넌트입니다.<br />' +
          '작성자, 작성시간, 제목, 내용 미리보기, 좋아요/댓글/스크랩 개수 등을 보여줍니다.<br /><br />' +
          '**참고**: 이 컴포넌트는 정보를 표시만 하며, 클릭 이벤트는 상위 컴포넌트에서 처리합니다.',
      },
    },
  },
  argTypes: {
    data: {
      description: '게시글 데이터 객체',
      control: 'object',
    },
    hasComment: {
      table: { disable: true },
    },
    hasLike: {
      table: { disable: true },
    },
  },
};

export default meta;

const Template = (args) => <PostBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: {
    userDisplay: '익명송이',
    createdAt: new Date().toISOString(),
    title: '예시 제목입니다',
    content:
      '예시 본문 내용입니다. 게시글의 미리보기 내용이 여기에 표시됩니다.',
    boardName: '첫눈온방',
    commentCount: 5,
    isLiked: false,
    likeCount: 12,
    isScrapped: false,
    scrapCount: 3,
    hasMediaAttachment: false,
  },
};

export const WithThumbnail = Template.bind({});
WithThumbnail.args = {
  data: {
    userDisplay: '익명송이',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
    title: '이미지가 포함된 게시글',
    content: '이미지가 첨부된 게시글의 예시입니다.',
    boardName: '자유게시판',
    commentCount: 15,
    isLiked: true,
    likeCount: 42,
    isScrapped: false,
    scrapCount: 8,
    hasMediaAttachment: true,
    thumbnailUrl: 'https://via.placeholder.com/150',
  },
};

export const ExamReview = Template.bind({});
ExamReview.args = {
  data: {
    userDisplay: '익명송이',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    title: '인간과우주 기말고사 후기',
    questionDetail: '총60문항/객관식7문항/ox53문항',
    boardName: '시험후기',
    commentCount: 8,
    likeCount: 25,
    scrapCount: 12,
    hasMediaAttachment: false,
  },
};
