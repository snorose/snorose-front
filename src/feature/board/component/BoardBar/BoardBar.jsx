import { Link } from 'react-router-dom';

import { Icon } from '@/shared/component';

import styles from './BoardBar.module.css';

export default function BoardBar({
  data,
  isFavorite = false,
  onFavoriteClick = () => {},
}) {
  return (
    <Link to={`/board/${data.textId}`} className={styles.container}>
      <BoardImage image={data.image} label={data.textId} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.description}>{data.desc}</p>
      </div>
      {/* <Icon
        className={styles.favoriteIcon}
        id='star'
        width={25}
        height={25}
        fill={isFavorite ? '#faee4c' : 'var(--grey-3)'} //나중에 data에 favorite 정보 들어오면 수정
        stroke={isFavorite ? '#faee4c' : 'var(--grey-3)'}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          onFavoriteClick();
          // 즐겨찾기 추가하는 로직 추가
        }}
      /> */}
    </Link>
  );
}

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체
 */
export function NewBoardBar({ name, to, desc, image }) {
  return (
    <Link to={to} className={styles.container}>
      <BoardImage image={image} label={name} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{desc}</p>
      </div>
      <Icon
        className={styles.favoriteIcon}
        id='star-circle'
        width={20}
        height={20}
      />
    </Link>
  );
}

function BoardImage({ image, label }) {
  if (!image) {
    return null;
  }

  // TODO: 모든 게시판 이미지를 @snorose/icons 컴포넌트로 교체하면 문자열 이미지 분기와 <img> 렌더링을 제거한다.
  if (typeof image === 'string') {
    return <img className={styles.image} src={image} alt={label} />;
  }

  const Image = image;

  return <Image className={styles.image} role='img' aria-label={label} />;
}
