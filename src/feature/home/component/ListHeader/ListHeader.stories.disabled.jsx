import ListHeader from './ListHeader';

const meta = {
  title: 'Feature/Home/ListHeader',
  component: ListHeader,
  parameters: {
    docs: {
      description: {
        component:
          'ListHeader 컴포넌트는 홈 화면의 섹션 제목과 "더보기" 링크를 제공합니다.<br />' +
          '게시글 목록 상단에 배치되어 해당 게시판으로 이동할 수 있습니다.',
      },
    },
  },
  argTypes: {
    title: {
      description: '섹션 제목',
      control: 'text',
    },
    to: {
      description: '더보기 클릭 시 이동할 경로',
      control: 'text',
    },
  },
};

export default meta;

const Template = (args) => <ListHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: '베숙톡',
  to: '/board/besookt',
};
