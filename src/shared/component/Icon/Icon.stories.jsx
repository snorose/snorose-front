import { Icon } from '@/shared/component';
import {
  STATIC_ICON_LIST,
  STROKE_ICON_LIST,
  ILLUSTRATION_ICON_LIST,
} from '@/shared/constant';

const iconStoryConfig = {
  title: 'Component/Icon',
  component: Icon,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    controls: { sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Icon 컴포넌트는 SVG 아이콘을 표시하는 컴포넌트입니다.<br />' +
          'id를 통해 아이콘을 선택하고, fill과 stroke 속성으로 색상을 변경할 수 있습니다.',
      },
    },
  },
  argTypes: {
    id: {
      description: '아이콘 ID (필수)',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    fill: {
      description: '아이콘의 fill 색상',
      control: 'color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'black' },
      },
    },
    stroke: {
      description: '아이콘의 stroke 색상',
      control: 'color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'black' },
      },
    },
  },
};

export default iconStoryConfig;

const Template = (args) => (
  <Icon {...args} style={{ width: '48px', height: '48px' }} />
);

export const Static = Template.bind({});
Static.args = {
  id: STATIC_ICON_LIST.home,
};
Static.argTypes = {
  id: {
    table: {
      type: { summary: 'string' },
      order: 1,
    },
    control: 'select',
    options: Object.values(STATIC_ICON_LIST),
  },
  fill: { table: { disable: true } },
  stroke: { table: { disable: true } },
};

export const Fill = Template.bind({});
Fill.args = {
  id: STATIC_ICON_LIST.homeFill,
  fill: '#00368E',
};
Fill.argTypes = {
  id: {
    table: {
      type: { summary: 'string' },
      order: 1,
    },
    control: 'select',
    options: Object.values(STATIC_ICON_LIST),
  },
  fill: {
    table: {
      defaultValue: { summary: 'black' },
    },
    control: {
      type: 'color',
    },
  },
  stroke: { table: { disable: true } },
};

const StrokeTemplate = (args) => (
  <Icon {...args} style={{ width: '26px', height: '26px' }} />
);

export const Stroke = StrokeTemplate.bind({});
Stroke.args = {
  id: STROKE_ICON_LIST.x,
  stroke: '#00368E',
};
Stroke.argTypes = {
  id: {
    table: {
      type: { summary: 'string' },
      order: 1,
    },
    control: 'select',
    options: Object.values(STROKE_ICON_LIST),
  },
  stroke: {
    table: {
      defaultValue: { summary: 'black' },
    },
    control: {
      type: 'color',
    },
  },
  fill: { table: { disable: true } },
};

const IllustrationTemplate = (args) => (
  <Icon {...args} style={{ width: '120px', height: '120px' }} />
);

export const Illustration = IllustrationTemplate.bind({});
Illustration.args = {
  id: ILLUSTRATION_ICON_LIST.starNoPost,
};
Illustration.argTypes = {
  id: {
    table: {
      type: { summary: 'string' },
      order: 1,
    },
    control: 'select',
    options: Object.values(ILLUSTRATION_ICON_LIST),
  },
  fill: { table: { disable: true } },
  stroke: { table: { disable: true } },
};
