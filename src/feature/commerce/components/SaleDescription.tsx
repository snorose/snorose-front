import { saleDescriptionToHtml } from '@/feature/commerce/lib/saleDescription';

import styles from './SaleDescription.module.css';

export default function SaleDescription({ value }: { value: string | null }) {
  if (!value) return null;
  return (
    <div
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: saleDescriptionToHtml(value) }}
    />
  );
}
