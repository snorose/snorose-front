import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import LegacyBoardRedirect from '@/LegacyBoardRedirect';

function CurrentLocation() {
  const { pathname, search, hash } = useLocation();

  return <p data-testid='location'>{`${pathname}${search}${hash}`}</p>;
}

function renderAt(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path='/board/studyabroad/*'
          element={
            <LegacyBoardRedirect
              from='/board/studyabroad'
              to='/board/study-abroad'
            />
          }
        />
        <Route path='*' element={<CurrentLocation />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LegacyBoardRedirect', () => {
  it('예전 게시판 주소를 새 주소로 이동시킨다', () => {
    renderAt('/board/studyabroad');

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/board/study-abroad'
    );
  });

  it('하위 경로·쿼리·해시를 유지한다', () => {
    renderAt('/board/studyabroad/post/123?sort=LATEST#comment');

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/board/study-abroad/post/123?sort=LATEST#comment'
    );
  });
});
