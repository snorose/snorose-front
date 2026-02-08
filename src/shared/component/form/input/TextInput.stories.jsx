import { useState } from 'react';
import TextInput from './TextInput';
import { Label, ErrorMessage } from '@/shared/component';

const meta = {
  title: 'Component/Input/TextInput',
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'TextInput 컴포넌트는 텍스트 입력을 위한 기본 Input 컴포넌트입니다.<br />' +
          '`status` prop을 통해 입력 상태(default, valid, error)를 시각적으로 표현합니다.<br />' +
          'InputLayout을 사용하여 일관된 스타일을 제공합니다.',
      },
    },
  },
  argTypes: {
    id: {
      description: 'input 요소의 id 속성',
      control: 'text',
    },
    placeholder: {
      description: '입력창에 표시될 placeholder 텍스트',
      control: 'text',
    },
    value: {
      description: '입력 필드의 값',
      control: 'text',
    },
    onChange: {
      description: '값이 변경될 때 호출되는 함수',
      action: 'changed',
    },
    status: {
      description: '입력 필드의 상태 (default, valid, error)',
      control: 'select',
      options: ['default', 'valid', 'error'],
    },
  },
};

export default meta;

const Template = (args) => {
  const [value, setValue] = useState(args.value || '');
  const [status, setStatus] = useState(args.status || 'default');

  const handleChange = (newValue) => {
    setValue(newValue);

    // 간단한 validation 예시
    if (newValue.trim().length === 0) {
      setStatus('default');
    } else if (newValue.trim().length >= 3) {
      setStatus('valid');
    } else {
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <Label htmlFor={args.id || 'text-input'}>이름</Label>
      <TextInput
        {...args}
        id={args.id || 'text-input'}
        value={value}
        onChange={handleChange}
        status={status}
      />
      {status === 'error' && <ErrorMessage>3자 이상 입력해주세요</ErrorMessage>}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: '이름을 입력하세요',
  status: 'default',
};

export const Valid = Template.bind({});
Valid.args = {
  placeholder: '이름을 입력하세요',
  value: '홍길동',
  status: 'valid',
};

export const Error = Template.bind({});
Error.args = {
  placeholder: '이름을 입력하세요',
  value: '가',
  status: 'error',
};
