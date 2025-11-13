import Button from './Button';

const submitButtonConfig = {
  title: 'Component/Button/Submit',
  component: Button,
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
          'Submit 버튼 컴포넌트는 폼 제출에 사용되는 버튼입니다.<br />' +
          '입력 상태에 따라 두 가지 스타일로 표시됩니다.<br /><br />' +
          '**상태별 스타일:**<br />' +
          '- `ready` 또는 `wrong`: 비활성 상태 (연한 파란색)<br />' +
          '- `right`: 제출 가능 (진한 파란색, 활성)',
      },
    },
  },
  argTypes: {
    btnName: {
      description: '버튼에 표시될 텍스트',
      control: 'text',
    },
    className: {
      description: '버튼 상태 (ready, wrong, right)',
      control: 'radio',
      options: ['ready', 'wrong', 'right'],
    },
  },
};
export default submitButtonConfig;

const Template = (args) => <Button {...args} />;

export const Disabled = Template.bind({});
Disabled.args = {
  btnName: '다음으로',
  className: 'ready',
};

export const Active = Template.bind({});
Active.args = {
  btnName: '다음으로',
  className: 'right',
};
