import { List } from '@/shared/component';

const meta = {
  title: 'Component/Navigation/List',
  component: List,
  parameters: {
    docs: {
      description: {
        component:
          '**List 컴포넌트**는 `<ul>` 태그를 기반으로 합니다. <br>' +
          '전달된 children 요소들을 리스트 형식으로 감싸고, className을 통해 커스텀 스타일을 확장할 수 있습니다.',
      },
    },
  },
  argTypes: {
    className: {
      table: { disable: true },
    },
    children: {
      control: false,
      description:
        '`<li>` 태그 등 React 노드를 전달하면, 컴포넌트 내부에서 `<ul>`로 감싸 렌더링합니다.',
      type: { name: 'string' },
    },
  },
};

export default meta;

const Template = (args) => <List {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <li>첫 번째 항목</li>
      <li>두 번째 항목</li>
      <li>세 번째 항목</li>
    </>
  ),
};
