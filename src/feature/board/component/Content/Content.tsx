import { linkifyHtml } from '@/shared/lib';

import styles from './Content.module.css';

export default function Content({ content }: { content: string }) {
  return (
    <div
      className={styles.container}
      dangerouslySetInnerHTML={{ __html: linkifyHtml(content) }}
    />
  );
}
