import ServerErrorFallback from '@/shared/component/suspense/ServerErrorFallback/ServerErrorFallback';

const serverErrorFallbackStoryConfig = {
  title: 'Component/ServerErrorFallback',
  component: ServerErrorFallback,
  parameters: {
    docs: {
      description: {
        component:
          'ServerErrorFallback 컴포넌트는 ErrorBoundary의 자식 컴포넌트가 렌더링 실패할 시 대신 렌더링되는 FallbackComponent입니다.<br /><br />' +
          '**ErrorBoundary와의 동작:**<br />' +
          'ErrorBoundary는 자신의 FallbackComponent에게 자동으로 `error`와 `resetErrorBoundary`를 전달합니다.<br />' +
          '- `error`: 어떤 에러가 발생했는지에 대한 정보가 담긴 Error Object<br />' +
          '- `resetErrorBoundary`: ErrorBoundary의 상태를 리셋하고 자식 컴포넌트를 다시 렌더링하는 함수<br /><br />' +
          'ServerErrorFallback은 `reset` prop을 받아 ResetButton으로 전달합니다.',
      },
    },
  },
  args: {
    reset: () => {},
  },
  argTypes: {
    reset: {
      description:
        '에러 상태를 리셋하고 컴포넌트를 다시 렌더링하는 함수입니다.',
      table: {
        type: {
          summary: 'function',
        },
      },
      control: { type: null },
    },
  },
};
export default serverErrorFallbackStoryConfig;

const Template = (args) => {
  return <ServerErrorFallback {...args} />;
};
export const Default = Template.bind({});
Default.args = {};
