import { defaultAxios } from '@/axios';

import { canLoadPopups, getPopups, isPopupMockEnabled } from './popup';

jest.mock('@/axios', () => ({ defaultAxios: { get: jest.fn() } }));
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.REACT_APP_POPUP_MOCK;
  delete process.env.REACT_APP_POPUP_API_PATH;
  jest.clearAllMocks();
});
afterEach(() => {
  process.env = originalEnv;
});

test('개발용 목 데이터는 관리자 상세 필드를 제공하고 서버를 호출하지 않는다', async () => {
  const data = await getPopups();
  expect(data).toHaveLength(4);
  expect(data[0]).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      displayOrder: expect.any(Number),
      title: expect.any(String),
      description: null,
      imageUrl: expect.any(String),
      startDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      status: 'ACTIVE',
      updatedAt: null,
    })
  );
  expect(defaultAxios.get).not.toHaveBeenCalled();
});
test('프로덕션은 명시적으로 켠 경우에만 목 데이터를 사용한다', () => {
  process.env.NODE_ENV = 'production';
  expect(isPopupMockEnabled()).toBe(false);
  expect(canLoadPopups()).toBe(false);
  process.env.REACT_APP_POPUP_MOCK = 'true';
  expect(isPopupMockEnabled()).toBe(true);
});
test('실제 모드는 지정한 사용자 API만 호출한다', async () => {
  process.env.REACT_APP_POPUP_MOCK = 'false';
  process.env.REACT_APP_POPUP_API_PATH = '/confirmed-user-popups';
  const result = [{ id: 1 }];
  defaultAxios.get.mockResolvedValue({ data: { isSuccess: true, result } });
  expect(await getPopups()).toEqual(result);
  expect(defaultAxios.get).toHaveBeenCalledWith('/confirmed-user-popups');
});
test('조회 경로가 없거나 서버 응답이 실패한 경우 관리자 API로 대체하지 않는다', async () => {
  process.env.REACT_APP_POPUP_MOCK = 'false';
  await expect(getPopups()).rejects.toThrow('사용자 팝업 조회 API');
  expect(defaultAxios.get).not.toHaveBeenCalled();
  process.env.REACT_APP_POPUP_API_PATH = '/confirmed-user-popups';
  defaultAxios.get.mockResolvedValue({
    data: { isSuccess: false, message: '실패' },
  });
  await expect(getPopups()).rejects.toThrow('실패');
});
