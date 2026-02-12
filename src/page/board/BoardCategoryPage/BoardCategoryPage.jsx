import { useNavigate } from 'react-router-dom';

import { Header } from '@/shared/component';
import { BOARD_REGISTRY } from '@/shared/lib';
import { BOARD_MENUS, NEW_ROUTES } from '@/shared/constant';

import { BoardBar, NewBoardBar } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import { BOARD_IMAGES } from '@/assets/map/board-assets';
import cloudLogo from '@/assets/images/cloudLogo.svg';

import styles from './BoardCategoryPage.module.css';

export default function BoardCategoryPage() {
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.target.value.trim() === '') {
      return;
    }

    /**
     * TODO(global search): 라우트 개선 작업 완료 후 교체 필요
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

/**
 * TODO(global search): 라우트 개선 작업 완료 후 교체 필요
 * TODO(board): 라우트 개선 작업 완료 후 교체 필요
 */
const COMMUNITIES = BOARD_REGISTRY.communities;
const OFFICIALS = BOARD_REGISTRY.officials;
const SNOROSES = [BOARD_REGISTRY.find('event')];

const BOARD_CATEGORIES = [
  { title: '커뮤니티', list: [...COMMUNITIES] },
  { title: '공식 게시판', list: [...OFFICIALS] },
  { title: '스노로즈 게시판', list: [...SNOROSES] },
];

export function NewBoardCategoryPage() {
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.target.value.trim() === '') {
      return;
    }

    navigate(NEW_ROUTES.globalSearch);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.searchbarBox}>
        <Search placeholder='전체 게시판 내 검색' onKeyDown={handleKeyDown} />
      </div>

      <div className={styles.paddingContainer}>
        {BOARD_CATEGORIES.map(({ title, list }) => (
          <div className={styles.boardBox}>
            <div className={styles.boardTitle}>{title}</div>
            <div className={styles.boardListBox}>
              {list.map(({ key, to, name, desc }) => (
                <NewBoardBar
                  key={`board-category-${key}`}
                  boardKey={key}
                  name={name}
                  desc={desc}
                  to={NEW_ROUTES.post.list(key)}
                  image={BOARD_IMAGES[key].category}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.moreBoardBox}>
        <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
        <p>스노로즈에서 더 다양한 게시판을 준비하고 있어요</p>
      </div>
    </div>
  );
}
