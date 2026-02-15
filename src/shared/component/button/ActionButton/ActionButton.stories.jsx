import { action } from '@storybook/addon-actions';
import ActionButton from './ActionButton';

const meta = {
  title: 'Component/Button/ActionButton',
  component: ActionButton,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
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
          'ActionButton은 사용자의 주요 행동을 유도하는 버튼 컴포넌트입니다.<br />' +
          '투명 배경에 텍스트만 표시되며, AppBar 내부나 페이지 하단 등에서 사용됩니다.',
      },
    },
  },
  argTypes: {
    children: {
      description: '버튼에 표시될 텍스트',
      control: 'text',
    },
    onClick: {
      description: '클릭 시 실행되는 함수',
      control: false,
    },
    disabled: {
      description: '버튼 비활성화 여부',
      control: 'boolean',
    },
  },
};

export default meta;

const Template = (args) => <ActionButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: '완료',
  onClick: action('button clicked'),
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: '완료',
  onClick: action('button clicked'),
  disabled: true,
};
