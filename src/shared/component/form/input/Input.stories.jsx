import { useState } from 'react';
import Input from './Input';

const meta = {
  title: 'Component/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Input 컴포넌트는 사용자 입력에 따라 스타일이 바뀌며, `ready`, `right`, `wrong` 상태로 입력 상태를 명확하게 시각화합니다.<br />' +
          '`Input.module.css`의 클래스에 따라 배경색, 글자색, placeholder 색 등이 동적으로 적용됩니다.<br />',
      },
    },
  },
  argTypes: {
    title: {
      description: '입력 필드 위에 표시될 제목 텍스트',
      control: 'text',
    },
    type: {
      description: 'input 태그의 type 속성 (예: text, email, password 등)',
      control: 'text',
    },
    placeholder: {
      description: '입력창에 표시될 placeholder 텍스트',
      control: 'text',
    },
    errMsg: {
      description: 'className이 "wrong"일 때 표시될 에러 메시지',
      control: 'text',
    },
    // 문서화에서 숨기기
    inputType: { table: { disable: true } },
    className: { table: { disable: true } },
    setClassName: { table: { disable: true } },
    classNameCheck: { table: { disable: true } },
    inputData: { table: { disable: true } },
    data: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    defaultClassName: { table: { disable: true } },
    value: { table: { disable: true } },
    containerWidth: { table: { disable: true } },
  },
};

export default meta;

const Template = (args) => {
  const [formData, setFormData] = useState({
    [args.inputType]: args.defaultValue || '',
  });
  const [inputClassName, setInputClassName] = useState(
    args.defaultClassName || 'ready'
  );

  return (
    <div
      style={{
        maxWidth: args.containerWidth || '400px',
        margin: '0 auto',
      }}
    >
      <Input
        {...args}
        data={formData}
        inputData={setFormData}
        className={inputClassName}
        setClassName={setInputClassName}
        classNameCheck={args.classNameCheck}
      />
    </div>
  );
};

// 기본 validation 함수
const defaultValidate = (value) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'ready';
  if (trimmed.length < 3) return 'wrong';
  return 'right';
};

export const Default = Template.bind({});
Default.args = {
  title: '이름',
  type: 'text',
  placeholder: '이름을 입력하세요',
  inputType: 'name',
  errMsg: '3자 이상 입력해주세요.',
  defaultValue: '',
  defaultClassName: 'ready',
  classNameCheck: defaultValidate,
  containerWidth: '400px',
};

export const RightInput = Template.bind({});
RightInput.args = {
  title: '이름',
  type: 'text',
  placeholder: '이름을 입력하세요',
  inputType: 'name',
  errMsg: '3자 이상 입력해주세요.',
  defaultValue: '홍길동',
  defaultClassName: 'right',
  classNameCheck: defaultValidate,
  containerWidth: '400px',
};

export const WrongInput = Template.bind({});
WrongInput.args = {
  title: '이름',
  type: 'text',
  placeholder: '이름을 입력하세요',
  inputType: 'name',
  errMsg: '3자 이상 입력해주세요.',
  defaultValue: '가',
  defaultClassName: 'wrong',
  classNameCheck: defaultValidate,
  containerWidth: '400px',
};
