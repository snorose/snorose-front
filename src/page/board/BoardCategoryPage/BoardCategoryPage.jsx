import { useNavigate } from 'react-router-dom';

import { Header } from '@/shared/component';
import { BOARD_MENUS, NEW_ROUTES } from '@/shared/constant';

import { BoardBar } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './BoardCategoryPage.module.css';

export default function BoardCategoryPage() {
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.target.value.trim() === '') {
      return;
    }

    /**
     * TODO: 라우트 개선 작업 완료 후 교체 필요
     */
    navigate(`/board/all/search`);
    // navigate(NEW_ROUTES.globalSearch);
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.searchbarBox}>
        <Search placeholder='전체 게시판 내 검색' onKeyDown={handleKeyDown} />
      </div>

      <div className={styles.paddingContainer}>
        <div className={styles.boardBox}>
          <div className={styles.boardTitle}>커뮤니티</div>
          <div className={styles.boardListBox}>
            {BOARD_MENUS.filter((board) =>
              [20, 21, 22, 23].includes(board.id)
            ).map((board, index) => (
              <BoardBar key={board.id} data={board} />
            ))}
          </div>
        </div>
        <div className={styles.boardBox}>
          <div className={styles.boardTitle}>공식 게시판</div>
          <div className={styles.boardListBox}>
            {BOARD_MENUS.filter((board) => [60, 61, 62].includes(board.id)).map(
              (board, index) => (
                <BoardBar key={board.id} data={board} />
              )
            )}
          </div>
        </div>
        <div className={styles.boardBox}>
          <div className={styles.boardTitle}>스노로즈 게시판</div>
          <div className={styles.boardListBox}>
            {BOARD_MENUS.filter((board) =>
              ['event'].includes(board.textId)
            ).map((board, index) => (
              <BoardBar key={board.id} data={board} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.moreBoardBox}>
        <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
        <p>스노로즈에서 더 다양한 게시판을 준비하고 있어요</p>
      </div>
    </div>
  );
}
