import { useState } from 'react';
import PullToRefresh from './PullToRefresh';
import { List } from '@/shared/component';
import { PostBar } from '@/feature/board/component';
import { POST_LIST } from '@/dummy/data/postList';

const PTRWrapper = (props) => {
  const [postList, setPostList] = useState(POST_LIST.slice(0, 3));

  const handleRefresh = () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate getting fresh data
        setPostList([...POST_LIST.slice(0, 3)]);
        console.log('Refreshed!');
        resolve();
      }, 1500);
    });
  };

  const newArgs = {
    children: (
      <List>
        {postList.map((post) => (
          <PostBar key={post.postId} data={post} hasLike={false} />
        ))}
      </List>
    ),
    onRefresh: handleRefresh,
  };

  return (
    <div style={{ height: '400px', overflow: 'hidden' }}>
      <PullToRefresh {...newArgs} />
    </div>
  );
};

const PTRStoryConfig = {
  title: 'Component/PullToRefresh',
  component: PullToRefresh,
  parameters: {
    docs: {
      description: {
        component:
          'PTR 컴포넌트는 게시판을 밑으로 당기면 새글을 불러주는 역할을 합니다.\n' +
          '전체 페이지가 refresh되는 것이 아니라, 게시판에서 글이 나타나는 부분만 refresh됩니다.\n\n' +
          'Refresh 중이면 위에 아이콘을 띄워줍니다.\n\n',

        // '**참고를 위해 쓰이는 파일 목록**\n' +
        // '- `SearchExamReviews.jsx`: ExamReviewsPage에 있는 PTR을 담당합니다.\n' +
        // '- `Posts.jsx`: ActivityPage와 기타 페이지들의 PTR을 담당합니다.\n' +
        // '- `SearchResults.jsx`: SearchPage의 PTR을 담당합니다. \n\n',
      },
    },
  },
  args: {
    children: undefined,
    onRefresh: undefined,
  },
  argTypes: {
    children: {
      description:
        'PTR 내에 있을 DOM들입니다. Link로 감싸진 PostBar 컴포넌트들입니다.',
      defaultValue: {},
      table: {
        type: {
          summary: 'DOM',
        },
      },
      control: { type: 'DOM' },
    },
    onRefresh: {
      description:
        '새로고침을 할 시에 하는 행동을 함수 형태로 넣습니다.\n\n 현재 모든 경우에 `() => refetch().then(() => console.log("Refreshed!"))`을 전달하고 있습니다.',
      defaultValue: true,
      table: {
        type: {
          summary: 'function',
        },
      },
      control: {
        type: 'function',
      },
    },
  },
};
export default PTRStoryConfig;

const Template = (args) => <PTRWrapper {...args} />;
export const Default = Template.bind({});
Default.args = {};
