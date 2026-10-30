import Footer from './Footer';

const meta = {
  title: 'Component/Footer',
  component: Footer,
  decorators: [
    (Story) => (
      <div style={{ width: '100%', backgroundColor: '#f9f9f9' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Footer 컴포넌트는 페이지 하단에 표시되는 푸터입니다.<br />' +
          '로고, 연락처 정보, 메뉴 링크, SNS 링크를 포함합니다.',
      },
    },
  },
};

export default meta;

const Template = () => <Footer />;

export const Default = Template.bind({});
