import { useState } from 'react';
import PasswordInput from './PasswordInput';
import { Label, ErrorMessage } from '@/shared/component';

const meta = {
  title: 'Component/Input/PasswordInput',
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          'PasswordInput 컴포넌트는 비밀번호 입력을 위한 Input 컴포넌트입니다.<br />' +
          '눈 아이콘을 클릭하여 비밀번호 표시/숨김을 토글할 수 있습니다.<br />' +
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

  const validatePassword = (password) => {
    // 최소 8자, 영문, 숫자 포함
    return (
      password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
    );
  };

  const handleChange = (newValue) => {
    setValue(newValue);

    if (newValue.length === 0) {
      setStatus('default');
    } else if (validatePassword(newValue)) {
      setStatus('valid');
    } else {
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <Label htmlFor={args.id || 'password-input'}>비밀번호</Label>
      <PasswordInput
        {...args}
        id={args.id || 'password-input'}
        value={value}
        onChange={handleChange}
        status={status}
      />
      {status === 'error' && (
        <ErrorMessage>8자 이상, 영문과 숫자를 포함해주세요</ErrorMessage>
      )}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: '비밀번호를 입력하세요',
  status: 'default',
};

export const Valid = Template.bind({});
Valid.args = {
  placeholder: '비밀번호를 입력하세요',
  value: 'password123',
  status: 'valid',
};

export const Error = Template.bind({});
Error.args = {
  placeholder: '비밀번호를 입력하세요',
  value: 'short',
  status: 'error',
};
