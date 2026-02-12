import { Link } from 'react-router-dom';

import { BoardKey } from '@/types';

import styles from './BoardBar.module.css';

export default function BoardBar({ data }) {
  return (
    <Link to={`/board/${data.textId}`} className={styles.container}>
      <img className={styles.image} src={data.image} alt={data.textId} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.description}>{data.desc}</p>
      </div>
    </Link>
  );
}

/**
 * TODO(board): 라우트 개선 작업 완료 후 교체
 */
type BoardBarProps = {
  boardKey: BoardKey;
  name: string;
  to: string;
  desc: string;
  image: string;
};

export function NewBoardBar({
  boardKey,
  name,
  to,
  desc,
  image,
}: BoardBarProps) {
  return (
    <Link to={to} className={styles.container}>
      <img className={styles.image} src={image} alt={boardKey} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{desc}</p>
      </div>
    </Link>
  );
}
