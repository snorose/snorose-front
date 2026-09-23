import { useState } from 'react';

import { useFeatureIsOn } from '@growthbook/growthbook-react';

import { Header } from '@/shared/component';
import { BOARD_CATEGORY, BOARD_MENUS, FEATURE_FLAG } from '@/shared/constant';

import { AccordianBoards, BoardBar } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import { BOARD_IMAGES } from '@/assets/map/board-assets';

import styles from './BoardCategoryPage.module.css';

const { HIDDEN, ...VISIBLE_BOARD_CATEGORY } = BOARD_CATEGORY;
const FAVORITE_BOARD_IDS = [20, 61]; //즐겨찾기 더미 데이터

export default function BoardCategoryPage() {
  const isCultureBoardOn = useFeatureIsOn(FEATURE_FLAG.cultureBoard);

  // 피처 플래그가 꺼진 대분류는 노출하지 않음
  const boardCategories = Object.values(VISIBLE_BOARD_CATEGORY).filter(
    (category) => category !== BOARD_CATEGORY.CULTURE || isCultureBoardOn
  );

  const initialOpenBoards = Object.fromEntries(
    boardCategories.map(({ value }) => [value, true])
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
        {boardCategories.map((category) => (
          <div key={category.value} className={styles.boardBox}>
            <AccordianBoards
              title={category.label}
              isOpen={openBoards[category.value] ?? true}
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
                        imageViewBox={boardImage?.categoryViewBox}
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
