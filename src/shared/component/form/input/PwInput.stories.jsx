import { useState } from 'react';
import PwInput from './PwInput';

const meta = {
  title: 'Component/PwInput',
  component: PwInput,
  decorators: [
    (Story) => (
      <div style={{ width: '400px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'PwInput 컴포넌트는 비밀번호 입력을 위한 컴포넌트입니다.<br />' +
          '입력값에 따라 색상이 동적으로 변경되며, 아이콘 클릭으로 비밀번호 표시/숨김을 토글할 수 있습니다.<br /><br />' +
          '**상태별 스타일:**<br />' +
          '- 기본: 회색 배경<br />' +
          '- 입력 중(에러 없음): 파란색 테두리<br />' +
          '- 에러: 빨간색 테두리 + 에러 메시지 표시<br />',
      },
    },
  },
  argTypes: {
    title: {
      description: '입력 필드 상단에 표시될 제목',
      control: 'text',
    },
    placeholder: {
      description: '입력 필드의 placeholder 텍스트',
      control: 'text',
    },
    value: {
      description: '입력 값',
      control: 'text',
    },
    onChange: {
      description: '입력 값 변경 시 호출되는 함수',
      control: false,
    },
    errorMessage: {
      description: '에러 메시지 (있을 경우 에러 스타일 적용)',
      control: 'text',
    },
    isStatic: {
      description: '상태에 따른 색상 변화 없이 회색으로 고정',
      control: 'boolean',
    },
  },
};

export default meta;

const Template = (args) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <PwInput
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  title: '비밀번호',
  placeholder: '비밀번호를 입력하세요',
  value: '',
  errorMessage: '',
  isStatic: false,
};

export const WithError = Template.bind({});
WithError.args = {
  title: '비밀번호',
  placeholder: '비밀번호를 입력하세요',
  value: '12',
  errorMessage: '8자 이상 입력해주세요.',
  isStatic: false,
};

export const Filled = Template.bind({});
Filled.args = {
  title: '비밀번호',
  placeholder: '비밀번호를 입력하세요',
  value: '12345678',
  errorMessage: '',
  isStatic: false,
};
