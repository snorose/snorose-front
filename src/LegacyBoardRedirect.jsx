import { Navigate, useLocation } from 'react-router-dom';

// 경로가 바뀐 게시판의 예전 주소로 들어오면 하위 경로와 쿼리를 유지한 채 새 주소로 이동시킨다.
export default function LegacyBoardRedirect({ from, to }) {
  const { pathname, search, hash } = useLocation();

  return (
    <Navigate to={`${pathname.replace(from, to)}${search}${hash}`} replace />
  );
}
