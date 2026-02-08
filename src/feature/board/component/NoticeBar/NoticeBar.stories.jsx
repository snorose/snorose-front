import { action } from '@storybook/addon-actions';
import NoticeBar from './NoticeBar';

const meta = {
  title: 'Feature/Board/NoticeBar',
  component: NoticeBar,
  parameters: {
    docs: {
      description: {
        component:
          'NoticeBar 컴포넌트는 공지사항 목록에서 각 게시물을 표시하는 컴포넌트입니다.<br />' +
          '제목, 내용, 작성일, 좋아요 수, 스크랩 수를 보여주며 클릭 이벤트를 처리할 수 있습니다.',
      },
    },
  },
  argTypes: {
    data: {
      description:
        '공지사항 데이터 객체 (title, content, createdAt, likeCount, scrapCount)',
      control: 'object',
    },
    onClick: {
      description: '공지사항 클릭 시 실행되는 함수',
      control: false,
    },
  },
};

export default meta;

const Template = (args) => <NoticeBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: {
    title: '스노로즈 2025년 1월 회계 보고',
    content:
      '안녕하세요, 스노로즈입니다. 2025년 1월 회계 내역을 보고드립니다. 아래 링크를 통해 확인하실 수 있으며, 숙명 메일 계정으로만 조회가 가능합니다. 개인정보 보호를 위해 이름 가운데 자리를 마스킹하였습니다. 지출 내역에 대한 영수증도 함께 확인하실 수 있습니다.',
    createdAt: '2025-01-15T10:30:00Z',
    likeCount: 45,
    scrapCount: 12,
  },
  onClick: action('NoticeBar clicked'),
};
