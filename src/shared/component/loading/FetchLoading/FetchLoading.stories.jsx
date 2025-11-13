import FetchLoading from './FetchLoading';

const meta = {
  title: 'Component/Loading/FetchLoading',
  component: FetchLoading,
  parameters: {
    docs: {
      description: {
        component:
          'FetchLoading 컴포넌트는 데이터를 불러오는 중 표시되는 로딩 UI입니다.<br />' +
          '중앙에 클라우드 아이콘과 텍스트를 표시하며, 아이콘은 회전 애니메이션이 적용됩니다.',
      },
    },
  },
  argTypes: {
    children: {
      description: '로딩 상태를 설명하는 텍스트',
      control: 'text',
    },
    animation: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
};

export default meta;

const Template = (args) => <FetchLoading {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: '데이터를 불러오고 있습니다...',
};
