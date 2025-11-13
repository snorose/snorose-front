import Search from '@/feature/search/component/Search/Search';
import { useNavigate } from 'react-router-dom';

const SearchWrapper = (props) => {
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.target.value.trim() === '') {
      return;
    }

    navigate(`/board/all/search`);
  };

  return <Search {...props} onKeyDown={props.onKeyDown || handleKeyDown} />;
};

const searchStoryConfig = {
  title: 'Component/Interaction/Search',
  component: Search,
  parameters: {
    docs: {
      description: {
        component:
          'Search 컴포넌트는 게시판에서 검색 기능을 담당합니다.\n\n' +
          '엔터키를 누르면 search함수가 실행되어 input내의 입력이 setSearchParams를 통해 \n' +
          'url에다가 입력 내용에 따라 "keyword" query string이 추가됩니다.\n' +
          '이 query string을 가지고 useSearch util이 입력 내용을 search해줍니다.  (useSuspensePagination안에 searchByBoard apis넣어줘서)\n\n' +
          '**참고를 위해 쓰이는 파일 목록**\n' +
          '- `BoardPage.jsx`: 유저가 여러 시험후기 중 필요한 후기를 찾을 수 있도록 Search를 씁니다.\n * className을 안 씁니다\n * onKeyDown에 input이 존재하는지 확인하고 유저를 search 페이지로 보내는 함수를 넣습니다.\n\n' +
          '- `ExamReviewsPage.jsx`: 유저가 여러 게시판을 통틀어 필요한 글을 찾을 수 있도록 Search를 씁니다.\n * className을 씁니다\n * onKeyDown을 안 씁니다.',
      },
    },
  },
  args: {
    className: null,
    placeholder: '전체 게시판 내 검색',
    onKeyDown: true,
  },
  argTypes: {
    className: {
      description: 'Search에다 추가적인 style을 적용합니다.\n',
      table: {
        type: {
          summary: 'CSS',
        },
      },
      control: { type: null },
    },
    placeholder: {
      description: `Search 컴포넌트 내에 있는 글(placeholder)입니다.`,
      table: {
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
      },
    },
    onKeyDown: {
      description:
        '키보드를 누를 때 실행시킬 함수를 전달 받습니다.\n\n' +
        'ex) BoardPage에서는 input내 입력된게 있으면 board/all/search로 이동하는 함수(handleKeyDown)가 건네져있다.',
      table: {
        type: {
          summary: 'function',
        },
      },
      control: {
        type: null,
      },
    },
  },
};
export default searchStoryConfig;

const Template = (args) => <SearchWrapper {...args} />;
export const Default = Template.bind({});
Default.args = {};
