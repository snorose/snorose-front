import MenuIcon from './MenuIcon';

const meta = {
  title: 'Component/Navigation/MenuIcon',
  component: MenuIcon,
  parameters: {
    docs: {
      description: {
        component:
          'MenuIcon 컴포넌트는 햄버거 아이콘을 클릭하여 사이드바를 열 수 있도록 하는 UI 요소입니다.',
      },
    },
  },
};

export default meta;

const Template = () => <MenuIcon />;

export const Default = Template.bind({});
