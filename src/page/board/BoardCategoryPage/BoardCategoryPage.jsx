import { useState } from 'react';

import { Header } from '@/shared/component';
import { BOARD_CATEGORY, BOARD_MENUS } from '@/shared/constant';

import { BoardBar, AccordianBoards } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import styles from './BoardCategoryPage.module.css';

const { HIDDEN, ...VISIBLE_BOARD_CATEGORY } = BOARD_CATEGORY;
const FAVORITE_BOARD_IDS = [20, 61]; //즐겨찾기 더미 데이터

export default function BoardCategoryPage() {
  const [openBoards, setOpenBoards] = useState(
    Object.fromEntries(
      Object.values(VISIBLE_BOARD_CATEGORY).map(({ value }) => [value, true])
    )
  );
  const toggleBoard = (boardName) => {
    setOpenBoards((prev) => ({
      ...prev,
      [boardName]: !prev[boardName],
    }));
  };
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.searchbarBox}>
        <Search placeholder='전체 게시판 내 검색' to='/board/all/search' />
      </div>

      <div className={styles.paddingContainer}>
        {Object.values(VISIBLE_BOARD_CATEGORY).map((category, index) => (
          <div className={styles.boardBox}>
            <AccordianBoards
              title={category.label}
              isOpen={openBoards[category.value]}
              onClick={() => toggleBoard(category.value)}
            >
              <div className={styles.boardListBox}>
                {BOARD_MENUS.filter((board) => board.category === category).map(
                  (board, index) => (
                    <BoardBar
                      key={board.id}
                      data={board}
                      isFavorite={FAVORITE_BOARD_IDS.includes(board.id)}
                    />
                  )
                )}
              </div>
            </AccordianBoards>
          </div>
        ))}
      </div>
    </div>
  );
}
