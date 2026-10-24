import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { getPopups } from '@/apis/popup';

import PopUp from './PopUp';

jest.mock(
  '@snorose/icons',
  () => ({
    IconMultiCheckBlueCircle: () => <svg aria-hidden='true' />,
    IconMultiCheckGreyCircle: () => <svg aria-hidden='true' />,
  }),
  { virtual: true }
);

jest.mock('@/apis/popup', () => ({
  canLoadPopups: () => true,
  getPopups: jest.fn(),
}));
const popup = {
  id: 1,
  title: '운영 안내',
  displayOrder: 0,
  startDate: '2026-10-20',
  endDate: '2026-10-20',
  description:
    '**굵은 글씨**\n\n- 첫 항목\n- 둘째 항목\n\n1. 순서 항목\n\n[내부 링크](/board/notice/post/123)\n\n[외부 링크](https://example.com)\n\n[위험 링크](javascript:alert(1))\n\n<script>alert(1)</script>',
  imageUrl: 'https://cdn.example.com/notice.webp',
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2026-10-20T12:00:00Z'));
  getPopups.mockResolvedValue([popup]);
});
afterEach(() => {
  jest.useRealTimers();
});
function renderPopup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <button>원래 포커스</button>
                <PopUp />
              </>
            }
          />
          <Route path='/board/notice/post/123' element={<p>게시글 화면</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('마크다운·목록·이미지를 표시하고 외부 링크와 위험한 HTML을 안전하게 처리한다', async () => {
  renderPopup();
  const dialog = await screen.findByRole('dialog', { name: '스노로즈 공지' });
  expect(dialog).toContainHTML('<strong>굵은 글씨</strong>');
  expect(screen.getAllByRole('list')[0]).toHaveTextContent('첫 항목');
  expect(screen.getAllByRole('list')[1]).toContainHTML('<li>순서 항목</li>');
  expect(screen.getByRole('img', { name: '운영 안내' })).toHaveAttribute(
    'src',
    popup.imageUrl
  );
  const external = screen.getByRole('link', { name: '외부 링크' });
  expect(external).toHaveAttribute('target', '_blank');
  expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  expect(
    screen.queryByRole('link', { name: '위험 링크' })
  ).not.toBeInTheDocument();
  expect(dialog).not.toContainHTML('<script>alert(1)</script>');
});
test('내부 링크는 SPA로 이동한다', async () => {
  renderPopup();
  fireEvent.click(await screen.findByRole('link', { name: '내부 링크' }));
  expect(await screen.findByText('게시글 화면')).toBeInTheDocument();
});
test('다이얼로그 안에서 포커스를 순환하고 Escape로 닫는다', async () => {
  renderPopup();
  const original = screen.getByRole('button', { name: '원래 포커스' });
  original.focus();
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveFocus();
  expect(document.body.style.overflow).toBe('hidden');
  const close = screen.getByRole('button', { name: '닫기' });
  close.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(screen.getByRole('link', { name: '내부 링크' })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
  expect(original).toHaveFocus();
  expect(localStorage.getItem('popUpState')).toBeNull();
});
test('오늘 하루 숨김을 선택하고 닫으면 저장한다', async () => {
  renderPopup();
  fireEvent.click(
    await screen.findByRole('checkbox', { name: '오늘 하루 보지 않기' })
  );
  fireEvent.click(screen.getByRole('button', { name: '닫기' }));
  expect(localStorage.getItem('popUpDate')).toBe('2026-10-20');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
test('숨김 기간에는 조회하지 않는다', () => {
  localStorage.setItem('popUpState', 'hidden');
  localStorage.setItem('popUpDate', '2026-10-20');
  renderPopup();
  expect(getPopups).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
test.each([{ data: [] }, { data: [{ ...popup, endDate: '2026-10-19' }] }])(
  '빈 목록·종료된 팝업은 표시하지 않는다',
  async ({ data }) => {
    getPopups.mockResolvedValue(data);
    renderPopup();
    await waitFor(() => expect(getPopups).toHaveBeenCalled());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  }
);
test('조회 실패가 홈 화면의 다른 동작을 가리지 않는다', async () => {
  getPopups.mockRejectedValue(new Error('미배포'));
  renderPopup();
  await waitFor(() => expect(getPopups).toHaveBeenCalled());
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: '원래 포커스' })
  ).toBeInTheDocument();
});
