import FetchLoadingOverlay from './FetchLoadingOverlay';

const meta = {
  title: 'Component/Loading/FetchLoadingOverlay',
  component: FetchLoadingOverlay,
  parameters: {
    docs: {
      description: {
        component:
          'FetchLoadingOverlay 컴포넌트는 데이터 로딩 시 오버레이와 함께 로딩 메시지를 표시합니다.<br />' +
          '내부적으로 FetchLoading 컴포넌트를 사용하며, 전체 화면을 덮는 반투명 배경 위에 로딩 UI를 표시합니다.',
      },
    },
  },
  argTypes: {
    text: {
      description: '로딩 중 화면에 표시할 텍스트',
      control: 'text',
    },
  },
};

export default meta;

const Template = (args) => (
  <div style={{ height: '200px', position: 'relative' }}>
    <FetchLoadingOverlay {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  text: '불러오는 중입니다...',
};
