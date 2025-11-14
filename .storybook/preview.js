import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/context/ToastContext';

import '@/index.css';
import '../.storybook/index.css';

/** @type { import('@storybook/react').Preview } */

// Storybook 세션에서 공유하도록 전역 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 테스트 환경에서는 API 재시도를 방지
      refetchOnWindowFocus: false, // Storybook 내에서 불필요한 refetch 방지
    },
  },
});

const preview = {
  parameters: {
    layout: 'centered',
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
  // 모든 스토리에 필요한 Provider 적용
  decorators: [
    (Story) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <div style={{ width: '600px' }}>
              <Story />
            </div>
          </ToastProvider>
        </QueryClientProvider>
      </BrowserRouter>
    ),
  ],
};

export default preview;
