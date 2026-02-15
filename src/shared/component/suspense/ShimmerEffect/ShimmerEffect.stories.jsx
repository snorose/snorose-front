import ShimmerEffect from './ShimmerEffect';

const meta = {
  title: 'Component/ShimmerEffect',
  component: ShimmerEffect,
  decorators: [
    (Story) => (
      <div>
        <style>
          {`
            .skeleton-box {
              width: 100%;
              height: 100px;
              background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
              background-size: 200% 100%;
              border-radius: 8px;
            }
          `}
        </style>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'ShimmerEffect 컴포넌트는 로딩 중임을 나타내기 위해 자식 요소에 반짝이는 애니메이션 효과를 추가합니다.<br />' +
          'Suspense의 fallback UI로 주로 사용되며, 스켈레톤 UI를 구성할 때 활용됩니다.<br /><br />' +
          '**사용 방법**: CSS에서 gradient 배경을 정의한 요소를 감싸면 자동으로 shimmer 애니메이션이 적용됩니다.',
      },
    },
  },
  argTypes: {
    children: {
      description: '반짝이는 애니메이션 효과를 적용할 자식 요소',
      control: false,
    },
  },
};

export default meta;

const Template = (args) => <ShimmerEffect {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: <div className='skeleton-box' />,
};
