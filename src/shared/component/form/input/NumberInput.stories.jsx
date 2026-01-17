import { useState } from 'react';
import NumberInput from './NumberInput';
import { Label, ErrorMessage } from '@/shared/component';

const meta = {
  title: 'Component/Form/NumberInput',
  component: NumberInput,
  parameters: {
    docs: {
      description: {
        component:
          'NumberInput 컴포넌트는 숫자 입력을 위한 Input 컴포넌트입니다.<br />' +
          'inputMode="numeric"을 사용하여 모바일에서 숫자 키보드를 표시합니다.<br />' +
          '숫자가 아닌 값은 자동으로 필터링됩니다.<br />' +
          '`maxLength` prop으로 입력 가능한 최대 글자 수를 제한할 수 있습니다.',
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
    maxLength: {
      description: '입력 가능한 최대 글자 수',
      control: 'number',
    },
  },
};

export default meta;

const Template = (args) => {
  const [value, setValue] = useState(args.value || '');
  const [status, setStatus] = useState(args.status || 'default');

  const handleChange = (newValue) => {
    setValue(newValue);
    
    if (newValue.length === 0) {
      setStatus('default');
    } else if (newValue.length >= 3) {
      setStatus('valid');
    } else {
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <Label htmlFor={args.id || 'number-input'}>학번</Label>
      <NumberInput
        {...args}
        id={args.id || 'number-input'}
        value={value}
        onChange={handleChange}
        status={status}
      />
      {status === 'error' && (
        <ErrorMessage>학번을 정확히 입력해주세요</ErrorMessage>
      )}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: '학번을 입력하세요',
  status: 'default',
};

export const Valid = Template.bind({});
Valid.args = {
  placeholder: '학번을 입력하세요',
  value: '2024001',
  status: 'valid',
};

export const Error = Template.bind({});
Error.args = {
  placeholder: '학번을 입력하세요',
  value: '12',
  status: 'error',
};

export const WithMaxLength = Template.bind({});
WithMaxLength.args = {
  placeholder: '인증번호 6자리',
  maxLength: 6,
  status: 'default',
};

