import { BOARD_REGISTRY } from '@/shared/lib/board-registry';
// index를 거치면 테스트 환경에서 불러올 수 없는 아이콘 패키지까지 함께 로드되므로 파일을 직접 import한다
import { isNewBoardPost, NEW_BOARD_KEYS } from '@/shared/lib/new-board';

describe('NEW_BOARD_KEYS', () => {
  it('모든 키가 게시판 레지스트리에 등록되어 있다', () => {
    NEW_BOARD_KEYS.forEach((key) => {
      expect(() => BOARD_REGISTRY.find(key)).not.toThrow();
    });
  });
});

describe('isNewBoardPost', () => {
  it.each([70, 25, 1015, 1016])(
    '신규 게시판 id(%i) 게시글을 걸러낸다',
    (boardId) => {
      expect(isNewBoardPost({ boardId })).toBe(true);
    }
  );

  it('문자열 id로 내려와도 걸러낸다', () => {
    expect(isNewBoardPost({ boardId: '70' })).toBe(true);
  });

  it.each(['동아리 이모저모', '홍보게시판', '리빙·소품', '여성학'])(
    'boardName(%s)만 있어도 걸러낸다',
    (boardName) => {
      expect(isNewBoardPost({ boardName })).toBe(true);
    }
  );

  it('신규 게시판이 아닌 게시글은 통과시킨다', () => {
    expect(isNewBoardPost({ boardId: 1014, boardName: '게임' })).toBe(false);
    expect(
      isNewBoardPost({ boardId: 71, boardName: '교환학생·어학연수' })
    ).toBe(false);
  });

  it('게시판 정보가 없으면 통과시킨다', () => {
    expect(isNewBoardPost({})).toBe(false);
  });
});
