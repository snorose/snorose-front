import Navbar from './Navbar';

const meta = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    docs: {
      description: {
        component:
          'Navbar 컴포넌트는 애플리케이션 하단에 위치하여 주요 메뉴에 빠르게 접근할 수 있도록 돕는 내비게이션 바입니다.',
      },
    },
  },
};

export default meta;

const Template = (args) => <Navbar {...args} />;

export const Default = Template.bind({});
Default.args = {};
