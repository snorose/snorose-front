import WriteButton from './WriteButton';

const writeButtonStoryConfig = {
  title: 'Component/Button/WriteButton',
  component: WriteButton,
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '300px',
          border: '1px dashed #ccc',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'WriteButton 컴포넌트는 게시판 우측 하단에 고정되는 글쓰기 버튼입니다.<br />' +
          '연필 아이콘을 표시하며, 클릭 시 글쓰기 페이지로 이동합니다.',
      },
    },
  },
  argTypes: {
    to: {
      description: '클릭 시 이동할 경로',
      control: 'text',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
};
export default writeButtonStoryConfig;

const Template = (args) => <WriteButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  to: '/board/write',
};
