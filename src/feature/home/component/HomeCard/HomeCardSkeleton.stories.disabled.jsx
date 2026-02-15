import HomeCardSkeleton from './HomeCardSkeleton';

const meta = {
  title: 'Feature/Home/HomeCardSkeleton',
  component: HomeCardSkeleton,
  parameters: {
    docs: {
      description: {
        component: `
**HomeCardSkeleton**은 HomeCard 컴포넌트가 로딩 중일 때 사용되는 스켈레톤 UI입니다.  
\`ShimmerEffect\` 컴포넌트를 통해 부드러운 로딩 애니메이션을 제공하며,  
\`.layout\`, \`.left\`, \`.right\` 클래스를 사용해 실제 카드 구조를 미리 보여줍니다.
`,
      },
    },
  },
};

export default meta;

const Template = (args) => <HomeCardSkeleton {...args} />;

export const Default = Template.bind({});
Default.args = {};
