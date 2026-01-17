import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Carousel from './Carousel';
import { QUERY_KEY } from '@/shared/constant';

const meta = {
  title: 'Feature/Home/Carousel',
  component: Carousel,
  decorators: [
    (Story) => {
      const queryClient = useQueryClient();

      useEffect(() => {
        // 예시 배너 데이터 설정
        const bannerData = [
          {
            imageUrl:
              'https://via.placeholder.com/800x400/00368e/ffffff?text=Banner+1',
            redirectUrl: '/board',
          },
          {
            imageUrl:
              'https://via.placeholder.com/800x400/ff4b6c/ffffff?text=Banner+2',
            redirectUrl: '/board/besookt',
          },
          {
            imageUrl:
              'https://via.placeholder.com/800x400/00c896/ffffff?text=Banner+3',
            redirectUrl: '/exam',
          },
        ];

        queryClient.setQueryData([QUERY_KEY.banner], bannerData);
      }, [queryClient]);

      return (
        <div style={{ overflowX: 'hidden', width: '100%', height: '240px' }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Carousel 컴포넌트는 홈 화면에 사용되는 배너 캐러셀입니다.<br />' +
          'Swiper를 기반으로 하며, 자동 슬라이드, 네비게이션, 페이지네이션 기능을 제공합니다.',
      },
    },
  },
  argTypes: {
    delay: {
      description: '자동 슬라이드 간의 지연 시간(ms)',
      control: 'number',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
};

export default meta;

const Template = (args) => <Carousel {...args} />;

export const Default = Template.bind({});
Default.args = {
  delay: 3000,
};
