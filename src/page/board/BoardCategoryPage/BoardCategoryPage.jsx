import { useState } from 'react';

import { Header } from '@/shared/component';
import { BOARD_MENUS } from '@/shared/constant';

import { BoardBar, AccordianBoards } from '@/feature/board/component';
import { Search } from '@/feature/search/component';

import styles from './BoardCategoryPage.module.css';

const FAVORITE_BOARD_IDS = [20, 61]; //즐겨찾기 더미 데이터

export default function BoardCategoryPage() {
  const [openBoards, setOpenBoards] = useState({
    community: true,
    official: true,
    snorose: true,
  });
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
        <div className={styles.boardBox}>
          <AccordianBoards
            title='커뮤니티'
            isOpen={openBoards.community}
            onClick={() => toggleBoard('community')}
          >
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
          </AccordianBoards>
        </div>
        <div className={styles.boardBox}>
          <AccordianBoards
            title='공식 게시판'
            isOpen={openBoards.official}
            onClick={() => toggleBoard('official')}
          >
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
          </AccordianBoards>
        </div>
        <div className={styles.boardBox}>
          <AccordianBoards
            title='스노로즈 게시판'
            isOpen={openBoards.snorose}
            onClick={() => toggleBoard('snorose')}
          >
            <div className={styles.boardListBox}>
              {BOARD_MENUS.filter((board) =>
                ['event'].includes(board.textId)
              ).map((board, index) => (
                <BoardBar key={board.id} data={board} />
              ))}
            </div>
          </AccordianBoards>
        </div>
      </div>
    </div>
  );
}
