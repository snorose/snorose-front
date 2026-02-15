import ReviewContentItem from './ReviewContentItem';
import { FLEX_ALIGN } from '@/feature/exam/constant';

const meta = {
  title: 'Feature/Exam/ReviewContentItem',
  component: ReviewContentItem,
  parameters: {
    docs: {
      description: {
        component:
          'ReviewContentItem 컴포넌트는 시험후기 상세 정보를 표시하는 아이템입니다.<br />' +
          '태그와 값을 구분하여 보여주며, 태그의 정렬 방식을 조정할 수 있습니다.',
      },
    },
  },
  argTypes: {
    tag: {
      description: '정보 태그 (예: 강의명, 교수, 시험 종류 등)',
      control: 'text',
    },
    value: {
      description: '정보 값',
      control: 'text',
    },
    align: {
      description: '태그의 정렬 방식',
      control: 'select',
      options: [FLEX_ALIGN.center, FLEX_ALIGN.flexStart],
    },
  },
};

export default meta;

const Template = (args) => <ReviewContentItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  tag: '강의명',
  value: '인간과우주',
  align: FLEX_ALIGN.center,
};

export const FlexStart = Template.bind({});
FlexStart.args = {
  tag: '시험유형및문항수',
  value: '총60문항/객관식7문항/ox53문항',
  align: FLEX_ALIGN.flexStart,
};
