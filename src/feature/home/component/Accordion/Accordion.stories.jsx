import { useState } from 'react';

import Accordion from './Accordion';

const meta = {
  title: 'Feature/Home/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '400px',
            padding: '0 1.4rem',
            borderRadius: '0.5rem',
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
          'Accordion 컴포넌트는 클릭하면 내용을 확장 및 축소할 수 있는 인터랙티브 UI입니다.<br />' +
          '제목을 클릭하면 내용이 펼쳐지고 접히며, 열림 상태에 따라 아이콘이 회전합니다.',
      },
    },
  },
  argTypes: {
    title: {
      description: '아코디언 헤더에 표시할 제목',
      control: 'text',
    },
    isOpen: {
      description: '아코디언 열림/닫힘 상태',
      control: 'boolean',
    },
    onClick: {
      description: '헤더 클릭 시 실행되는 함수',
      action: 'clicked',
    },
    children: {
      description: '아코디언 본문 내용',
      control: false,
    },
  },
};

export default meta;

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);
  return (
    <Accordion {...args} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
  );
};

export const Default = Template.bind({});
Default.args = {
  title: '아코디언 제목',
  children: <p>아코디언 내용입니다. 클릭하면 열리고 닫힙니다.</p>,
  isOpen: false,
};
