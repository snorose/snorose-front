import { React } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';

import styles from './Guideline.module.css';

export default function Guideline({ guideImages, guideStyle, children }) {
  return (
    <div className={styles.guidelineContainer}>
      <div className={styles.guideContainer}>
        <Swiper modules={[Navigation]} navigation className={styles.swiper}>
          {guideImages.map((img, i) => (
            <SwiperSlide key={i} className={styles.swiperSlide}>
              <img src={img} style={guideStyle} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {children}
    </div>
  );
}
