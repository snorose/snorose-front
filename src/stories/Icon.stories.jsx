import { Icon } from '@/shared/component';
import {
  STATIC_ICON_LIST,
  FILL_ICON_LIST,
  STROKE_ICON_LIST,
  ILLUSTRATION_ICON_LIST,
} from '@/shared/constant';

const iconStoryConfig = {
  title: 'Component/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    controls: { sort: 'requiredFirst' },
  },
};

export default iconStoryConfig;

export const Static = {
  argTypes: {
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
  },
};

export const Fill = {
  argTypes: {
    id: {
      table: {
        type: { summary: 'string' },
        order: 1,
      },
      control: 'select',
      options: Object.values(FILL_ICON_LIST),
    },
    fill: {
      table: {
        defaultValue: { summary: 'none' },
      },
      control: {
        type: 'color',
      },
    },
    stroke: { table: { disable: true } },
  },
};

export const Stroke = {
  argTypes: {
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
        defaultValue: { summary: 'none' },
      },
      control: {
        type: 'color',
      },
    },
    fill: { table: { disable: true } },
  },
};

export const Illustration = {
  argTypes: {
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
  },
};
