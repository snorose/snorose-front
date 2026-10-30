import AppBar from './AppBar';

const meta = {
  title: 'Component/Layout/AppBar',
  component: AppBar,
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minHeight: '200px', position: 'relative' }}>
        <Story />
        <div style={{ padding: '20px', marginTop: '60px' }}>
          <p>AppBar 아래 컨텐츠 영역입니다.</p>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'AppBar 컴포넌트는 페이지 상단에 고정되는 앱바입니다.<br />' +
          '제목과 자식 요소를 표시하며, 배경색과 고정 여부를 설정할 수 있습니다.',
      },
    },
  },
  argTypes: {
    title: {
      description: 'AppBar에 표시할 제목',
      control: 'text',
    },
    backgroundColor: {
      description: 'AppBar 배경색',
      control: 'color',
    },
    notFixed: {
      description: '고정 위치 해제 여부 (true일 경우 relative)',
      control: 'boolean',
    },
    children: {
      description: 'AppBar 오른쪽에 표시할 자식 요소',
      control: false,
    },
  },
};

export default meta;

const Template = (args) => <AppBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: '제목',
  backgroundColor: '#fff',
  notFixed: false,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  title: '제목',
  backgroundColor: '#fff',
  notFixed: false,
  children: (
    <button style={{ padding: '8px 16px', backgroundColor: '#00368e', color: 'white', border: 'none', borderRadius: '4px' }}>
      버튼
    </button>
  ),
};

export const NotFixed = Template.bind({});
NotFixed.args = {
  title: '고정되지 않은 AppBar',
  backgroundColor: '#eaf5fd',
  notFixed: true,
};

