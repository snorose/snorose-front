import { useState } from 'react';
import Textarea from './Textarea';

const meta = {
  title: 'Component/Form/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'Textarea 컴포넌트는 `react-textarea-autosize`를 기반으로 한 자동 높이 조절 입력 필드입니다.<br />' +
          '사용자의 입력에 따라 줄 수가 자동으로 늘어나며, `minRows` 및 `maxRows`로 최소/최대 높이를 제한할 수 있습니다.<br />' +
          '`onChange`를 통해 외부 상태와 연동되며, 회색 배경에 둥근 모서리 스타일이 적용되어 있습니다.<br /><br />',
      },
    },
  },
  argTypes: {
    placeholder: {
      description: '입력창에 표시될 placeholder 텍스트',
      control: 'text',
    },
    minRows: {
      description: '최소 표시 줄 수',
      control: 'number',
    },
    maxRows: {
      description: '최대 표시 줄 수',
      control: 'number',
    },
    // 문서화에서 숨기기
    id: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    containerWidth: { table: { disable: true } },
  },
};

export default meta;

const Template = (args) => {
  const [text, setText] = useState(args.defaultValue || '');

  return (
    <div
      style={{
        maxWidth: args.containerWidth || '400px',
        margin: '0 auto',
      }}
    >
      <Textarea {...args} value={text} onChange={setText} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: '내용을 입력하세요',
  minRows: 3,
  maxRows: 8,
  defaultValue: '',
  containerWidth: '400px',
};

export const WithText = Template.bind({});
WithText.args = {
  placeholder: '내용을 입력하세요',
  minRows: 3,
  maxRows: 8,
  defaultValue: '이미 입력된 텍스트가 있습니다.\n여러 줄로 작성할 수 있어요.',
  containerWidth: '400px',
};
