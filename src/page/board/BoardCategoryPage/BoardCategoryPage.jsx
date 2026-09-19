import { useState } from 'react';

import { Header } from '@/shared/component';
import { BOARD_CATEGORY, BOARD_MENUS } from '@/shared/constant';

import { AccordianBoards, BoardBar } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import { BOARD_IMAGES } from '@/assets/map/board-assets';

import styles from './BoardCategoryPage.module.css';

const { HIDDEN, ...VISIBLE_BOARD_CATEGORY } = BOARD_CATEGORY;
const FAVORITE_BOARD_IDS = [20, 61]; //즐겨찾기 더미 데이터

export default function BoardCategoryPage() {
  const initialOpenBoards = Object.fromEntries(
    Object.values(VISIBLE_BOARD_CATEGORY).map(({ value }) => [value, true])
  );
  const [openBoards, setOpenBoards] = useState(initialOpenBoards);
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
        {Object.values(VISIBLE_BOARD_CATEGORY).map((category) => (
          <div key={category.value} className={styles.boardBox}>
            <AccordianBoards
              title={category.label}
              isOpen={openBoards[category.value]}
              onClick={() => toggleBoard(category.value)}
            >
              <div className={styles.boardListBox}>
                {BOARD_MENUS.filter((board) => board.category === category).map(
                  (board) => {
                    const boardImage = BOARD_IMAGES[board.textId];

                    return (
                      <BoardBar
                        key={board.id}
                        data={board}
                        image={boardImage?.category}
                        imageLayout={boardImage?.categoryLayout}
                        isFavorite={FAVORITE_BOARD_IDS.includes(board.id)}
                      />
                    );
                  }
                )}
              </div>
            </AccordianBoards>
          </div>
        ))}
      </div>
    </div>
  );
}
