import { React, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';

import styles from './Guideline.module.css';

export default function Guideline({ guideImages, guideStyle, children }) {
  const paginationRef = useRef(null);
  return (
    <div className={styles.guidelineContainer}>
      <div className={styles.guideContainer}>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{
            el: '.swiper-custom-pagination',
            clickable: true,
          }}
          className={styles.swiper}
        >
          <div
            className={`swiper-custom-pagination ${styles.pagination}`}
            ref={paginationRef}
          ></div>
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
