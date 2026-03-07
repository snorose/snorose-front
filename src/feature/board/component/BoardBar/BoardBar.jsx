import { Link } from 'react-router-dom';

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
export function NewBoardBar({ name, to, desc, image }) {
  return (
    <Link to={to} className={styles.container}>
      <img className={styles.image} src={image} alt={name} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{desc}</p>
      </div>
    </Link>
  );
}
