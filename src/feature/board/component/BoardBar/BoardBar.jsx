import { Link } from 'react-router-dom';

import { Icon } from '@/shared/component';

import styles from './BoardBar.module.css';

export default function BoardBar({ data }) {
  return (
    <Link to={`/board/${data.textId}`} className={styles.container}>
      <img className={styles.image} src={data.image} alt={data.textId} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.description}>{data.desc}</p>
      </div>
      <Icon
        className={styles.favoriteIcon}
        id='star'
        width={25}
        height={25}
        fill={true ? 'var(--grey-3)' : '#faee4c'} //나중에 data에 favorite 정보 들어오면 수정
        stroke={true ? 'var(--grey-3)' : '#faee4c'}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          // 즐겨찾기 추가하는 로직 추가
        }}
      />
    </Link>
  );
}

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체
 */
export function NewBoardBar({ name, to, desc, image }) {
  return (
    <Link to={to} className={styles.container}>
      <img className={styles.image} src={image} alt={name} />
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
