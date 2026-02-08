import Sidebar from './Sidebar';
import { useSidebarStore } from '@/shared/store';

const sidebarStoryConfig = {
  title: 'Component/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          'Sidebar 컴포넌트는 메인페이지 우측 상단의 햄버거 아이콘을 누르면 나타나는 사이드바입니다.\n\n' +
          '로그인 상태/계정의 종류에 따라서 SIDEBAR_MENUS(constants)중에 골라서 메뉴 타이틀과 MenuList를 띄워줍니다.\n\n',

        // '**참고를 위해 쓰이는 파일 목록**\n' +
        // '- `App.jsx`\n\n',
      },
    },
  },
  args: {},
  argTypes: {},
};
export default sidebarStoryConfig;

const Template = (args) => {
  const open = useSidebarStore((state) => state.open);
  open();
  return (
    <div style={{ width: '100%', height: '95vh', padding: '20px' }}>
      <Sidebar {...args} />
    </div>
  );
};
export const Default = Template.bind({});
Default.args = {};
