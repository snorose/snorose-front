import { React, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';

import styles from './Guideline.module.css';

export default function Guideline({ guideImages, children }) {
  const paginationRef = useRef(null);
  return (
    <div className={styles.guidelineContainer}>
      <div className={styles.guideContainer}>
        <button className={`swiper-button-prev ${styles.chevron}`}></button>
        <button className={`swiper-button-next ${styles.chevron}`}></button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
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
              <img src={img} className={styles.guide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {children}
      {/*<div className={styles.buttons}>
        <button className={styles.button}>닫기</button>
        <button className={styles.button}>다시는 보지 않기</button>
      </div>*/}
    </div>
  );
}
