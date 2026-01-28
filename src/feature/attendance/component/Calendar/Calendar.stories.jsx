import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Calendar from './Calendar';
import { QUERY_KEY } from '@/shared/constant';

const meta = {
  title: 'Feature/Attendance/Calendar',
  component: Calendar,
  decorators: [
    (Story) => {
      const queryClient = useQueryClient();

      // 현재 월 데이터를 미리 설정하여 API 호출 방지
      useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        // 예시 출석 데이터 생성 (현재 월의 1일, 5일, 10일)
        const differences = [1, 2, 3];
        const attendanceData = [1, 5, 10]
          .filter((day) => {
            const date = new Date(year, month - 1, day);
            return date.getMonth() === month - 1;
          })
          .map((day, index) => {
            const date = new Date(year, month - 1, day);
            return {
              createdAt: date.toISOString(),
              difference: differences[index % differences.length],
            };
          });

        queryClient.setQueryData(
          [QUERY_KEY.attendance, year, month],
          attendanceData
        );
      }, [queryClient]);

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--blue-4)',
            padding: '20px',
            minHeight: '400px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Story />
          </div>
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Calendar 컴포넌트는 월별 출석 데이터를 표시하는 캘린더 UI입니다.<br />' +
          '출석한 날짜는 체크 아이콘으로 표시되며, 날짜 변경 시 React Query를 통해 해당 월의 출석 정보를 불러옵니다.',
      },
    },
  },
  argTypes: {
    callback: {
      description: '출석 데이터가 로드될 때 실행되는 콜백 함수',
      action: 'callback triggered',
    },
  },
};

export default meta;

const Template = (args) => <Calendar {...args} />;

export const Default = Template.bind({});
Default.args = {
  callback: (data) => {
    console.log('Attendance data:', data);
  },
};
