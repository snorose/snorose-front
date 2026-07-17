import { Header } from '@/shared/component';
import { BOARD_MENUS } from '@/shared/constant';

import { BoardBar, DropDownBoards } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import styles from './BoardCategoryPage.module.css';

const FAVORITE_BOARD_IDS = [20, 61];

export default function BoardCategoryPage() {
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.searchbarBox}>
        <Search placeholder='전체 게시판 내 검색' to='/board/all/search' />
      </div>

      <div className={styles.paddingContainer}>
        <div className={styles.boardBox}>
          <DropDownBoards
            title='즐겨찾는 게시판'
            isOpen={true}
            onClick={() => {}}
          >
            <div className={styles.boardListBox}>
              {BOARD_MENUS.filter((board) =>
                FAVORITE_BOARD_IDS.includes(board.id)
              ).map((board, index) => (
                <BoardBar key={board.id} data={board} isFavorite={true} />
              ))}
            </div>
          </DropDownBoards>
        </div>
        <div className={styles.boardBox}>
          <DropDownBoards title='커뮤니티' isOpen={true} onClick={() => {}}>
            <div className={styles.boardListBox}>
              {BOARD_MENUS.filter((board) =>
                [20, 21, 22, 23].includes(board.id)
              ).map((board, index) => (
                <BoardBar
                  key={board.id}
                  data={board}
                  isFavorite={FAVORITE_BOARD_IDS.includes(board.id)}
                />
              ))}
            </div>
          </DropDownBoards>
        </div>
        <div className={styles.boardBox}>
          <DropDownBoards title='공식 게시판' isOpen={true} onClick={() => {}}>
            <div className={styles.boardListBox}>
              {BOARD_MENUS.filter((board) =>
                [60, 61, 62].includes(board.id)
              ).map((board, index) => (
                <BoardBar
                  key={board.id}
                  data={board}
                  isFavorite={FAVORITE_BOARD_IDS.includes(board.id)}
                />
              ))}
            </div>
          </DropDownBoards>
        </div>
        <div className={styles.boardBox}>
          <DropDownBoards
            title='스노로즈 게시판'
            isOpen={true}
            onClick={() => {}}
          >
            <div className={styles.boardListBox}>
              {BOARD_MENUS.filter((board) =>
                ['event'].includes(board.textId)
              ).map((board, index) => (
                <BoardBar key={board.id} data={board} />
              ))}
            </div>
          </DropDownBoards>
        </div>
      </div>
    </div>
  );
}
