import HomeCard from './HomeCard';

const meta = {
  title: 'Feature/Home/HomeCard',
  component: HomeCard,
  parameters: {
    docs: {
      description: {
        component:
          'HomeCard 컴포넌트는 홈 화면에 공지 및 출석 체크 카드를 표시하는 UI 컴포넌트입니다.\n\n' +
          '로그인 여부에 따라 표시되는 카드가 달라집니다.\n' +
          '- 로그인 상태 : 공지 카드 + 출석 체크 카드가 표시됩니다.\n' +
          '- 비로그인 상태 : 공지 카드만 표시됩니다.\n\n' +
          '공지 데이터는 React Query의 useSuspenseQuery를 통해 서버에서 불러오며,\n' +
          '사용자 로그인 상태는 useAuth 커스텀 훅을 통해 확인합니다.\n\n' +
          '각 카드는 아이콘, 제목, 태그, 링크로 구성되어 있으며,\n' +
          '로그인 여부에 따라 카드의 스타일이 달라집니다.',
      },
    },
  },
};

export default meta;

const Template = (args) => <HomeCard {...args} />;

export const Default = Template.bind({});
Default.args = {};
