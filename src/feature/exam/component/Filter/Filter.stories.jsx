import Filter from './Filter';

const meta = {
  title: 'Feature/Exam/Filter',
  component: Filter,
  parameters: {
    docs: {
      description: {
        component:
          'Filter 컴포넌트는 드롭다운 방식으로 옵션을 선택할 수 있도록 하며, 선택된 옵션은 URL의 쿼리 파라미터에 반영됩니다. `filterKey`는 쿼리 파라미터의 키를 의미하고, `options`는 선택 가능한 옵션 목록입니다.',
      },
    },
  },
  argTypes: {
    filterKey: {
      control: 'text',
      description: 'URL에 사용할 쿼리 파라미터 키 이름',
    },
    placeholder: {
      control: 'text',
      description: '선택 전 표시될 기본 텍스트',
    },
    options: {
      control: 'object',
      description: '옵션 배열 (id, name 포함)',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '200px',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

const Template = (args) => <Filter {...args} />;

export const Default = Template.bind({});
Default.args = {
  filterKey: 'category',
  placeholder: '시험종류',
  options: [
    { id: 1, name: '중간고사' },
    { id: 2, name: '기말고사' },
  ],
};
