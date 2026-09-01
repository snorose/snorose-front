import { Icon } from '@/shared/component';

import altImage from '@/assets/images/altImage.png';

import styles from './ProductCard.module.css';

type ProductCardProps = {
  src: string;
  alt: string;
};

export default function ProductCard({ src, alt }: ProductCardProps) {
  if (src) {
    return (
      <div className={styles.container}>
        <img
          className={styles.image}
          src={src}
          alt={alt}
          onError={(e) => (e.currentTarget.src = altImage)}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageFallback} aria-label='상품 이미지 없음'>
        <Icon id='image' width={32} height={32} />
      </div>
    </div>
  );
}
