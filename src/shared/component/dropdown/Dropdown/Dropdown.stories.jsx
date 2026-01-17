import { useState } from 'react';

import Dropdown from './Dropdown';

const meta = {
  title: 'Component/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <div
        style={{
          width: '300px',
          margin: '0 auto',
          padding: '20px',
          minHeight: '200px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown 컴포넌트는 선택 가능한 옵션 목록을 표시하는 드롭다운입니다.<br />' +
          '클릭하면 옵션 목록이 열리고, 옵션을 선택하면 선택된 값이 표시됩니다.',
      },
    },
  },
  argTypes: {
    options: {
      description: '드롭다운에 표시할 옵션 배열 (각 항목은 { id, name } 형태)',
      control: 'object',
    },
    placeholder: {
      description: '선택되지 않았을 때 표시할 텍스트',
      control: 'text',
    },
    select: {
      description: '현재 선택된 항목 ({ id, name })',
      control: 'object',
    },
    setFn: {
      description: '선택 변경 시 호출되는 함수',
      action: 'selected',
    },
  },
};

export default meta;

const Template = (args) => {
  const [select, setSelect] = useState(args.select || null);

  return (
    <Dropdown
      {...args}
      select={select}
      setFn={(prev, option) => {
        setSelect(option);
        args.setFn?.(prev, option);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  options: [
    { id: 1, name: '옵션 1' },
    { id: 2, name: '옵션 2' },
    { id: 3, name: '옵션 3' },
  ],
  placeholder: '선택하세요',
  select: null,
};

export const WithSelection = Template.bind({});
WithSelection.args = {
  options: [
    { id: 1, name: '경영학과' },
    { id: 2, name: '컴퓨터과학과' },
    { id: 3, name: '수학과' },
    { id: 4, name: '테슬(TESL)전공' },
  ],
  placeholder: '전공을 선택하세요',
  select: { id: 1, name: '경영학과' },
};
