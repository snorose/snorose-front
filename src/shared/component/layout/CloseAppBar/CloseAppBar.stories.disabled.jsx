import CloseAppBar from './CloseAppBar';
import { ActionButton } from '@/shared/component';

const meta = {
  title: 'Component/Layout/CloseAppBar',
  component: CloseAppBar,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '300px',
          gap: '2rem',
        }}
      >
        <Story />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#eaf5fd',
            color: '#00368e',
            fontSize: '1.6rem',
            fontWeight: '500',
            borderRadius: '1.2rem',
          }}
        >
          본문 영역
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'CloseAppBar 컴포넌트는 닫기(X) 버튼이 있는 상단 AppBar입니다.<br />' +
          '닫기 버튼 클릭 시 onClose 핸들러를 실행하거나, 기본적으로 이전 페이지로 이동합니다.',
      },
    },
  },
  argTypes: {
    alignRight: {
      description: '액션 영역을 오른쪽 끝으로 정렬',
      control: 'boolean',
    },
    stroke: {
      description: '닫기 아이콘 선 색상',
      control: 'color',
    },
    onClose: {
      description: '닫기 버튼 클릭 시 실행되는 핸들러',
      action: 'onClose',
    },
    notFixed: {
      description: 'AppBar를 fixed 대신 relative로 표시',
      control: 'boolean',
    },
    backgroundColor: {
      description: 'AppBar 배경색',
      control: 'color',
    },
    children: {
      description: '오른쪽 영역에 배치할 추가 요소',
      control: false,
    },
  },
};

export default meta;

const Template = (args) => <CloseAppBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#fff',
  stroke: '#000',
};

export const WithActions = Template.bind({});
WithActions.args = {
  backgroundColor: '#fff',
  children: <ActionButton>등록</ActionButton>,
};
