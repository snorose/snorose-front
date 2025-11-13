import StageDots from './StageDots';

const stageDotsStoryConfig = {
  title: 'Component/Display/StageDots',
  component: StageDots,
  parameters: {
    docs: {
      description: {
        component:
          'StageDots 컴포넌트는 회원가입 단계를 직관적으로 보여줍니다.\n\n' +
          '회원가입 단계에 따라 파랗게 변하는 버튼이 달라집니다.\n\n' +
          '**참고를 위해 쓰이는 파일 목록**\n' +
          '- `SignUpPage.jsx`: 회원가입 단계를 유저들에게 직관적으로 보여주기 위해서 StageDots를 사용합니다.\n\n',
      },
    },
  },
  args: {
    quantity: 3,
    current: 1,
    size: '0.625rem',
    width: '3.125rem',
    gap: '0.688rem',
  },
  argTypes: {
    quantity: {
      description: '점의 전체 개수입니다. (단계 개수)\n',
      table: {
        type: {
          summary: 'integer',
        },
      },
      control: { type: 'number' },
    },
    current: {
      description: `파란색 점의 위치입니다. (현 단계 위치)`,
      table: {
        type: {
          summary: 'integer',
        },
      },
      control: {
        type: 'number',
      },
    },
    size: {
      description: '점의 크기이자 프레임의 높이입니다.\n\n' + 'ex) "0.625rem"',
      table: {
        type: {
          summary: 'CSS String',
        },
      },
      control: {
        type: 'text',
      },
    },
    width: {
      description: '전체 프레임의 크기입니다.\n\n' + 'ex) "3.125rem"',
      table: {
        type: {
          summary: 'CSS String',
        },
      },
      control: {
        type: 'text',
      },
    },
    gap: {
      description: '점 사이의 거리입니다.\n\n' + 'ex) "0.688rem"',
      table: {
        type: {
          summary: 'CSS String',
        },
      },
      control: {
        type: 'text',
      },
    },
  },
};
export default stageDotsStoryConfig;

const Template = (args) => <StageDots {...args} />;
export const Default = Template.bind({});
Default.args = {};
