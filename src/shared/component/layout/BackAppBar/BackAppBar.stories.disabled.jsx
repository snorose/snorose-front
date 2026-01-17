import BackAppBar from './BackAppBar';

const meta = {
  title: 'Component/Layout/BackAppBar',
  component: BackAppBar,
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          minHeight: '220px',
          paddingTop: '60px',
          backgroundColor: '#f5f7fa',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'BackAppBar 컴포넌트는 페이지 상단에서 뒤로가기 버튼을 제공하는 앱바입니다.<br />' +
          '검색 버튼, 메뉴 버튼, 사용자 정의 액션 등을 조합하여 사용할 수 있습니다.',
      },
    },
  },
  argTypes: {
    title: {
      description: 'AppBar에 표시할 제목',
      control: 'text',
    },
    hasMenu: {
      description: '메뉴 아이콘 표시 여부',
      control: 'boolean',
    },
    hasSearch: {
      description: '검색 아이콘 표시 여부',
      control: 'boolean',
    },
    hasSearchInput: {
      description: '검색 입력 필드가 추가되어 여백을 확보할지 여부',
      control: 'boolean',
    },
    isDark: {
      description: '어두운 배경에서 사용할 때 아이콘 색상을 흰색으로 변경',
      control: 'boolean',
    },
    notFixed: {
      description: 'AppBar를 fixed 대신 relative로 표시',
      control: 'boolean',
    },
    backNavTo: {
      description: '뒤로가기 클릭 시 이동할 경로 (미설정 시 history -1)',
      control: 'text',
    },
    backgroundColor: {
      description: 'AppBar 배경색',
      control: 'color',
    },
    children: {
      description: 'AppBar 오른쪽 영역에 표시할 추가 요소',
      control: false,
    },
  },
};

export default meta;

const Template = (args) => <BackAppBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: '공지사항',
  backNavTo: '/',
};

export const WithSearchAndMenu = Template.bind({});
WithSearchAndMenu.args = {
  title: '첫눈온방',
  hasSearch: true,
  hasMenu: true,
  backNavTo: '/exam',
};
