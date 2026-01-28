import { useState } from 'react';
import EmailInput from './EmailInput';
import { Label, ErrorMessage } from '@/shared/component';

const meta = {
  title: 'Component/Form/EmailInput',
  component: EmailInput,
  parameters: {
    docs: {
      description: {
        component:
          'EmailInput 컴포넌트는 이메일 입력을 위한 Input 컴포넌트입니다.<br />' +
          'type="email"과 inputMode="email"을 사용하여 모바일에서 이메일 키보드를 표시합니다.<br />' +
          '`status` prop을 통해 입력 상태(default, valid, error)를 시각적으로 표현합니다.',
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
    
    if (newValue.trim().length === 0) {
      setStatus('default');
    } else if (validateEmail(newValue)) {
      setStatus('valid');
    } else {
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <Label htmlFor={args.id || 'email-input'}>이메일</Label>
      <EmailInput
        {...args}
        id={args.id || 'email-input'}
        value={value}
        onChange={handleChange}
        status={status}
      />
      {status === 'error' && (
        <ErrorMessage>올바른 이메일 형식을 입력해주세요</ErrorMessage>
      )}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'example@email.com',
  status: 'default',
};

export const Valid = Template.bind({});
Valid.args = {
  placeholder: 'example@email.com',
  value: 'user@example.com',
  status: 'valid',
};

export const Error = Template.bind({});
Error.args = {
  placeholder: 'example@email.com',
  value: 'invalid-email',
  status: 'error',
};

