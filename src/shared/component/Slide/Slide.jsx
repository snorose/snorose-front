import { useState } from 'react';

import defaultBanner from '@/assets/images/bannerError.svg';

import styles from './Slide.module.css';

export default function Slide({ src, redirectUrl, alt }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <a className={styles.slide} href={redirectUrl}>
      <img
        src={imgSrc}
        loading='lazy'
        alt={alt}
        onError={() => setImgSrc(defaultBanner)}
      />
    </a>
  );
}
