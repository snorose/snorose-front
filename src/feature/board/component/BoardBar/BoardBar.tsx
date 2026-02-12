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
