import { serializeEventContent } from '@/feature/event/lib/content';

import { authAxios } from '@/axios';

import { getEventContent, patchEvent, postEvent } from './event';
import { putFileInBucket } from './post';

jest.mock('@/axios', () => ({
  authAxios: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));
jest.mock('@/shared/lib', () => ({ DateTime: { format: (value) => value } }));
jest.mock('./post', () => ({ putFileInBucket: jest.fn() }));

const event = {
  category: '기타',
  title: '이벤트 제목',
  content: '<p>이벤트 상세 설명</p>',
  host: '주최사',
  isNotice: false,
};
const response = (urls = []) => ({
  status: 201,
  data: { result: { postId: 42, attachmentUrlList: urls } },
});
const file = new File(['image'], 'event.png', { type: 'image/png' });
const attachment = {
  id: '',
  type: 'PHOTO',
  fileName: file.name,
  fileComment: '',
  file,
};

beforeEach(() => {
  jest.resetAllMocks();
  putFileInBucket.mockResolvedValue(undefined);
});

test('첨부 없는 이벤트 생성도 빈 첨부 배열을 전송한다', async () => {
  authAxios.post.mockResolvedValue(response());
  await postEvent(event);
  expect(authAxios.post).toHaveBeenCalledWith(
    '/v1/events',
    expect.objectContaining({
      ...event,
      content: serializeEventContent(event.content),
      attachments: [],
      startAt: null,
      endAt: null,
      announceAt: null,
    })
  );
  expect(putFileInBucket).not.toHaveBeenCalled();
});

test('이벤트 생성 후 발급된 URL에 파일 업로드가 끝나야 성공한다', async () => {
  const result = response(['https://upload.test/1']);
  authAxios.post.mockResolvedValue(result);
  let finishUpload;
  let markUploadStarted;
  const uploadStarted = new Promise((resolve) => {
    markUploadStarted = resolve;
  });
  putFileInBucket.mockImplementation(
    () =>
      new Promise((resolve) => {
        finishUpload = resolve;
        markUploadStarted();
      })
  );
  const completed = jest.fn();
  const request = postEvent({ ...event, attachmentsInfo: [attachment] }).then(
    completed
  );
  await uploadStarted;
  expect(completed).not.toHaveBeenCalled();
  expect(putFileInBucket).toHaveBeenCalledWith(
    ['https://upload.test/1'],
    [file]
  );
  finishUpload();
  await request;
  expect(completed).toHaveBeenCalledWith(result);
});

test('수정은 기존 첨부 ID와 순서를 유지하고 새 파일만 업로드한다', async () => {
  authAxios.patch.mockResolvedValue(response(['https://upload.test/new']));
  const kept = {
    id: 7,
    type: 'PHOTO',
    fileName: 'kept.png',
    fileComment: '유지',
  };
  await patchEvent({
    ...event,
    postId: 42,
    attachmentsInfo: [attachment, kept],
    deleteAttachments: [8],
  });
  expect(authAxios.patch).toHaveBeenCalledWith(
    'v1/events/42',
    expect.objectContaining({
      finalAttachments: [
        { id: null, type: 'PHOTO', fileName: file.name, fileComment: '' },
        kept,
      ],
      deleteAttachments: [8],
    })
  );
  expect(putFileInBucket).toHaveBeenCalledWith(
    ['https://upload.test/new'],
    [file]
  );
});

test('첨부를 모두 삭제하는 수정도 두 배열을 명시한다', async () => {
  authAxios.patch.mockResolvedValue(response());
  await patchEvent({
    ...event,
    postId: 42,
    attachmentsInfo: [],
    deleteAttachments: [7],
  });
  expect(authAxios.patch).toHaveBeenCalledWith(
    'v1/events/42',
    expect.objectContaining({
      finalAttachments: [],
      deleteAttachments: [7],
    })
  );
  expect(putFileInBucket).not.toHaveBeenCalled();
});

test('기존 첨부 목록을 아직 모르면 수정 요청을 보내지 않는다', async () => {
  await expect(patchEvent({ ...event, postId: 42 })).rejects.toThrow(
    '기존 첨부파일'
  );
  expect(authAxios.patch).not.toHaveBeenCalled();
});

test('5분 후 재시도해도 기존 글에서 새 업로드 주소를 받아 중복 생성 없이 복구한다', async () => {
  const result = response(['https://upload.test/1']);
  const renewed = response(['https://upload.test/fresh']);
  authAxios.post.mockResolvedValue(result);
  authAxios.get.mockResolvedValue({
    data: { result: { attachments: [{ ...attachment, id: 100 }] } },
  });
  authAxios.patch.mockResolvedValue(renewed);
  putFileInBucket.mockRejectedValueOnce(new Error('Network Error'));
  const error = await postEvent({
    ...event,
    attachmentsInfo: [attachment],
  }).catch((error) => error);
  expect(error.message).toContain('게시글은 저장됐지만');
  const now = jest
    .spyOn(Date, 'now')
    .mockReturnValue(Date.now() + 6 * 60 * 1000);
  try {
    await expect(error.retryUpload()).resolves.toBe(renewed);
  } finally {
    now.mockRestore();
  }
  expect(authAxios.post).toHaveBeenCalledTimes(1);
  expect(authAxios.patch).toHaveBeenCalledWith('v1/events/42', {
    finalAttachments: [
      { id: null, type: 'PHOTO', fileName: 'event.png', fileComment: '' },
    ],
    deleteAttachments: [100],
  });
  expect(putFileInBucket).toHaveBeenLastCalledWith(
    ['https://upload.test/fresh'],
    [file]
  );
  expect(putFileInBucket).toHaveBeenCalledTimes(2);
});

test('수정 재시도는 기존 첨부와 순서를 유지하고 새 첨부만 교체하며 반복 실패에도 복구한다', async () => {
  const kept = {
    id: 7,
    type: 'PHOTO',
    fileName: 'kept.png',
    fileComment: '유지',
  };
  authAxios.patch
    .mockResolvedValueOnce(response(['https://upload.test/expired']))
    .mockResolvedValueOnce(response(['https://upload.test/fresh-1']))
    .mockResolvedValueOnce(response(['https://upload.test/fresh-2']));
  authAxios.get
    .mockResolvedValueOnce({
      data: { result: { attachments: [{ ...attachment, id: 100 }, kept] } },
    })
    .mockResolvedValueOnce({
      data: { result: { attachments: [{ ...attachment, id: 101 }, kept] } },
    });
  putFileInBucket
    .mockRejectedValueOnce(new Error('Network Error'))
    .mockRejectedValueOnce(new Error('Expired URL'));
  const firstError = await patchEvent({
    ...event,
    postId: 42,
    attachmentsInfo: [attachment, kept],
    deleteAttachments: [8],
  }).catch((error) => error);
  const secondError = await firstError.retryUpload().catch((error) => error);
  await secondError.retryUpload();
  expect(authAxios.post).not.toHaveBeenCalled();
  expect(authAxios.patch.mock.calls[2][1]).toEqual({
    finalAttachments: [
      { id: null, type: 'PHOTO', fileName: 'event.png', fileComment: '' },
      kept,
    ],
    deleteAttachments: [101],
  });
  expect(putFileInBucket).toHaveBeenLastCalledWith(
    ['https://upload.test/fresh-2'],
    [file]
  );
});

test('재시도 전에 첨부 구성이 바뀌면 다른 편집자의 첨부를 삭제하지 않는다', async () => {
  authAxios.post.mockResolvedValue(response(['https://upload.test/expired']));
  putFileInBucket.mockRejectedValueOnce(new Error('Network Error'));
  authAxios.get.mockResolvedValue({
    data: {
      result: {
        attachments: [{ id: 100, type: 'PHOTO', fileName: 'other.png' }],
      },
    },
  });
  const error = await postEvent({
    ...event,
    attachmentsInfo: [attachment],
  }).catch((error) => error);
  await expect(error.retryUpload()).rejects.toThrow('첨부파일 구성이 변경');
  expect(authAxios.patch).not.toHaveBeenCalled();
});

test('파일 개수와 업로드 URL 개수가 다르면 업로드 성공으로 처리하지 않는다', async () => {
  authAxios.post.mockResolvedValue(response());
  await expect(
    postEvent({ ...event, attachmentsInfo: [attachment] })
  ).rejects.toThrow('업로드에 실패');
  expect(putFileInBucket).not.toHaveBeenCalled();
});

test('예전 이벤트의 누락된 첨부 목록은 빈 배열로 조회한다', async () => {
  authAxios.get.mockResolvedValue({
    data: { result: { ...event, attachments: null } },
  });
  await expect(getEventContent(42)).resolves.toEqual({
    ...event,
    attachments: [],
  });
});

test.each([
  [undefined, null],
  [null, null],
  ['', null],
  ['   ', null],
  [' 10명 ', '10명'],
  ['0명', '0명'],
  [' 미정 ', '미정'],
])(
  '생성과 수정 모두 추첨 인원 %s를 %s로 저장한다',
  async (drawCount, expected) => {
    authAxios.post.mockResolvedValue(response());
    authAxios.patch.mockResolvedValue(response());
    await postEvent({ ...event, drawCount });
    await patchEvent({ ...event, postId: 42, drawCount, attachmentsInfo: [] });
    expect(authAxios.post.mock.calls[0][1].drawCount).toBe(expected);
    expect(authAxios.patch.mock.calls[0][1].drawCount).toBe(expected);
  }
);

test.each([
  [undefined, null],
  [null, null],
  ['', null],
  ['   ', null],
  [' https://example.com/apply ', 'https://example.com/apply'],
])(
  '빈 링크는 null로 보내 기존 링크도 삭제할 수 있다: %s',
  async (link, expected) => {
    authAxios.post.mockResolvedValue(response());
    authAxios.patch.mockResolvedValue(response());
    await postEvent({ ...event, link });
    await patchEvent({ ...event, postId: 42, link, attachmentsInfo: [] });
    expect(authAxios.post.mock.calls[0][1].link).toBe(expected);
    expect(authAxios.patch.mock.calls[0][1].link).toBe(expected);
  }
);
