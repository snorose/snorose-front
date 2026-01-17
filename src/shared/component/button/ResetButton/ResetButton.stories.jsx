import { action } from '@storybook/addon-actions';
import ResetButton from './ResetButton';

const resetButtonStoryConfig = {
  title: 'Component/ResetButton',
  component: ResetButton,
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
          'ResetButton 컴포넌트는 에러 발생 시 재시도를 위한 버튼입니다.<br />' +
          '리플레이 아이콘을 표시하며, 클릭 시 에러 상태를 리셋하고 컴포넌트를 다시 렌더링합니다.<br />' +
          'ServerErrorFallback 등에서 사용됩니다.',
      },
    },
  },
  argTypes: {
    reset: {
      description: '클릭 시 실행되는 리셋 함수',
      control: false,
    },
  },
};
export default resetButtonStoryConfig;

const Template = (args) => <ResetButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  reset: action('reset clicked'),
};
