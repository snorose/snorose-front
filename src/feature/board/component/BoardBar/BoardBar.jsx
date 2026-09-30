import { Link } from 'react-router-dom';

import { IconStar } from '@snorose/icons';

import styles from './BoardBar.module.css';

function getImageStyle(layout) {
  if (!layout) return undefined;

  return {
    '--board-image-right': layout.right,
    '--board-image-bottom': layout.bottom,
    '--board-image-width': layout.width,
    '--board-image-height': layout.height,
    '--board-image-overflow': layout.overflow,
  };
}

export default function BoardBar({
  data,
  image,
  imageLayout,
  imageViewBox,
  isFavorite = false,
  onFavoriteClick = () => {},
}) {
  return (
    <Link to={`/board/${data.textId}`} className={styles.container}>
      <BoardImage
        image={image}
        label={data.textId}
        style={getImageStyle(imageLayout)}
        viewBox={imageViewBox}
      />
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
export function NewBoardBar({ name, to, desc, image, imageLayout }) {
  return (
    <Link to={to} className={styles.container}>
      <BoardImage
        image={image}
        label={name}
        style={getImageStyle(imageLayout)}
      />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{desc}</p>
      </div>
      <IconStar
        className={styles.favoriteIcon}
        width={20}
        height={20}
        color='var(--blue-4)'
      />
    </Link>
  );
}

function BoardImage({ image, label, style, viewBox }) {
  if (!image) {
    return null;
  }

  const Image = image;

  return (
    <Image
      className={styles.image}
      role='img'
      aria-label={label}
      style={style}
      {...(viewBox ? { viewBox } : {})}
    />
  );
}
