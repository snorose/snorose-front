import HomeCardErrorFallback from './HomeCardErrorFallback';

const meta = {
  title: 'Feature/Home/HomeCardErrorFallback',
  component: HomeCardErrorFallback,
  parameters: {
    docs: {
      description: {
        component: `
HomeCardErrorFallback 컴포넌트는 에러 바운더리 안에서 오류가 발생했을 때 사용자에게 보여주는 대체 UI입니다.
공통 컴포넌트인 ServerErrorFallback을 기반으로 하고 있으며, reset 기능을 통해 재시도할 수 있습니다.
`,
      },
    },
  },
  argTypes: {
    error: {
      control: false,
      description: '발생한 에러 객체',
    },
    resetErrorBoundary: {
      action: 'resetErrorBoundary called',
      description: '에러 바운더리를 리셋하는 콜백 함수',
    },
  },
};

export default meta;

const Template = (args) => <HomeCardErrorFallback {...args} />;

export const Default = Template.bind({});
Default.args = {};
