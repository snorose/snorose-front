import { StrictMode, useState } from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import EventForm from './EventForm';

const mockValid = jest.fn();
const mockError = jest.fn();

jest.mock(
  '@snorose/icons',
  () => ({
    IconImage: () => <svg aria-hidden='true' />,
    IconVideo: () => <svg aria-hidden='true' />,
    IconX: () => <svg aria-hidden='true' />,
  }),
  { virtual: true }
);
jest.mock('@/shared/component', () => ({
  PrimaryButton: jest.requireActual(
    '@/shared/component/button/PrimaryButton/PrimaryButton'
  ).default,
}));
jest.mock('@/shared/constant', () => ({
  ...jest.requireActual('@/shared/constant/attachment'),
  TOAST: {
    EVENT: { EMPTY: '빈 링크', FAIL: '잘못된 링크' },
    ATTACHMENT: { imageQuantityError: '사진은 최대 5개예요' },
  },
}));
jest.mock('@/shared/hook', () => ({
  useToast: () => ({ toast: { error: mockError } }),
}));
jest.mock('@/shared/lib', () => ({ DateTime: { format: (value) => value } }));
jest.mock('@/feature/event/component', () => ({
  DateField: jest.requireActual('../DateField/DateField').default,
  TextField: jest.requireActual('../TextField/TextField').default,
}));
jest.mock('@/feature/editor/component', () => ({
  EditorContainer: ({ text, onChangeEditor }) => (
    <textarea
      aria-label='상세 설명'
      value={text}
      onChange={(event) =>
        onChangeEditor({ getHTML: () => event.target.value })
      }
    />
  ),
}));

const initial = {
  title: '이벤트 제목',
  host: '주최사',
  content: '충분한 이벤트 본문',
  place: '',
  link: '',
  startAt: '',
  endAt: '',
  announceAt: '',
  drawCount: '',
};

function Harness({ values = {}, errors = {} }) {
  const [data, setData] = useState({ ...initial, ...values });
  const [attachmentsInfo, setAttachmentsInfo] = useState([]);
  return (
    <EventForm
      data={data}
      formType='etc'
      onChange={(field, value) =>
        setData((previous) => ({ ...previous, [field]: value }))
      }
      onValid={mockValid}
      errors={errors}
      attachmentsInfo={attachmentsInfo}
      setAttachmentsInfo={setAttachmentsInfo}
      onDeleteAttachment={(index) =>
        setAttachmentsInfo((previous) => previous.filter((_, i) => i !== index))
      }
    />
  );
}

const originalCreate = URL.createObjectURL;
const originalRevoke = URL.revokeObjectURL;
beforeEach(() => {
  jest.clearAllMocks();
  let nextUrl = 0;
  URL.createObjectURL = jest.fn(() => `blob:event-test-${nextUrl++}`);
  URL.revokeObjectURL = jest.fn();
});
afterEach(() => {
  cleanup();
  URL.createObjectURL = originalCreate;
  URL.revokeObjectURL = originalRevoke;
});

test('링크 없이도 작성 가능하고 날짜와 인원은 항상 보인다', async () => {
  render(<Harness />);
  await waitFor(() => expect(mockValid).toHaveBeenLastCalledWith(true));
  expect(
    screen.queryByRole('button', { name: /추가 정보/ })
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText('시작일')).toBeVisible();
  expect(screen.getByLabelText('종료일')).toBeVisible();
  expect(screen.getByLabelText('당첨자 발표일')).toBeVisible();
  expect(screen.getByLabelText('추첨 인원')).toBeVisible();
  expect(screen.getByRole('button', { name: '미리보기' })).toBeDisabled();
  expect(screen.getByRole('region', { name: '사진·영상 첨부' })).toBeVisible();
});

test('기존 일정과 추첨 인원 값을 그대로 표시한다', () => {
  render(
    <Harness values={{ startAt: '2026-11-20T10:00:00', drawCount: '10명' }} />
  );
  expect(screen.getByLabelText('시작일')).toBeVisible();
  expect(screen.getByLabelText('시작일')).toHaveValue('2026-11-20T10:00');
  expect(screen.getByLabelText('추첨 인원')).toHaveValue('10명');
});

test('직접 입력한 추첨 인원 텍스트는 그대로 표시한다', () => {
  render(<Harness values={{ drawCount: '미정' }} />);
  expect(screen.getByLabelText('추첨 인원')).toBeVisible();
  expect(screen.getByLabelText('추첨 인원')).toHaveValue('미정');
});

test('날짜 항목의 검증 오류를 바로 표시한다', () => {
  const { rerender } = render(<Harness />);
  expect(screen.getByLabelText('종료일')).toBeVisible();
  rerender(<Harness errors={{ endAt: '종료일을 확인해주세요' }} />);
  expect(screen.getByLabelText('종료일')).toBeVisible();
  expect(screen.getByText('종료일을 확인해주세요')).toBeVisible();
});

test('추첨 인원은 자동 입력 없이 비워둘 수 있고 직접 입력한 값은 유지한다', () => {
  render(<Harness />);
  const input = screen.getByLabelText('추첨 인원');
  fireEvent.blur(input);
  expect(input).toHaveValue('');
  fireEvent.change(input, { target: { value: '10명' } });
  fireEvent.blur(input);
  expect(input).toHaveValue('10명');
  fireEvent.change(input, { target: { value: '' } });
  fireEvent.blur(input);
  expect(input).toHaveValue('');
});

test('사진 추가, 터치용 화살표 재정렬, 카드 안의 삭제 버튼이 같은 첨부 목록을 갱신한다', () => {
  render(<Harness />);
  const files = ['first.png', 'second.png', 'third.png'].map(
    (name) => new File(['image'], name, { type: 'image/png' })
  );
  fireEvent.change(screen.getByLabelText('이미지 첨부'), { target: { files } });
  expect(
    screen.getAllByRole('img').map((image) => image.getAttribute('alt'))
  ).toEqual(files.map((file) => file.name));
  fireEvent.click(
    screen.getByRole('button', { name: 'second.png 앞으로 이동' })
  );
  expect(
    screen.getAllByRole('img').map((image) => image.getAttribute('alt'))
  ).toEqual(['second.png', 'first.png', 'third.png']);
  fireEvent.click(screen.getByRole('button', { name: 'first.png 삭제' }));
  expect(
    screen.getAllByRole('img').map((image) => image.getAttribute('alt'))
  ).toEqual(['second.png', 'third.png']);
  expect(URL.revokeObjectURL).toHaveBeenCalled();
});

test('새 첨부 영역도 기존 최대 사진 개수 정책을 적용한다', () => {
  render(<Harness />);
  const files = Array.from(
    { length: 6 },
    (_, i) => new File(['image'], `${i}.png`, { type: 'image/png' })
  );
  fireEvent.change(screen.getByLabelText('이미지 첨부'), { target: { files } });
  expect(mockError).toHaveBeenCalledWith('사진은 최대 5개예요');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('Strict Mode에서도 화면의 사진 미리보기 URL은 해제되지 않는다', () => {
  render(
    <StrictMode>
      <Harness />
    </StrictMode>
  );
  fireEvent.change(screen.getByLabelText('이미지 첨부'), {
    target: {
      files: [new File(['image'], 'preview.png', { type: 'image/png' })],
    },
  });
  const currentUrl = screen
    .getByRole('img', { name: 'preview.png' })
    .getAttribute('src');
  expect(
    URL.revokeObjectURL.mock.calls.some(([url]) => url === currentUrl)
  ).toBe(false);
});
