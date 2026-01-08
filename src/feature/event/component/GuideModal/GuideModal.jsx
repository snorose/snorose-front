import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper/modules';

import { Icon } from '@/shared/component';
import styles from './GuideModal.module.css';
import 'swiper/css';
import 'swiper/css/pagination';

export default function GuideModal({
  boardName,
  options,
  onConfirm,
  onClose,
  onIsLast,
}) {
  const swiperRef = useRef(null);
  const [step, setStep] = useState(0); // 현재 인덱스
  const isLast = step === options.length - 1;
  const navigate = useNavigate();

  const handleNext = () => {
    if (isLast) {
      onConfirm();
    }
    swiperRef.current && swiperRef.current.slideNext();
  };

  const goEventNotice = () => {
    navigate(`/board/${boardName}/notice`);
  };

  return (
    <div className={styles.box}>
      <div className={styles.modal}>
        <div className={styles.modalTop}>
          <button className={styles.close} onClick={onClose}>
            <Icon
              className={styles.close}
              id='x'
              width={18}
              height={18}
              stroke={'grey'}
            />
          </button>
        </div>

        <div className={styles.modalContent}>
          <Swiper
            className={styles.modalContent}
            modules={[Pagination, Keyboard]}
            slidesPerView={1}
            allowTouchMove
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            onSwiper={(swipe) => (swiperRef.current = swipe)}
            onSlideChange={(swipe) => setStep(swipe.activeIndex)}
          >
            {options.map((option, index) => (
              <SwiperSlide key={index}>
                <div className={styles.illustration}>
                  <img
                    src={option.image}
                    alt={`illustration-${index}`}
                    className={styles.image}
                  />
                </div>
                <h2>{option.title}</h2>
                <div className={styles.content}>{option.content}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={styles.buttons}>
          <button className={styles.goNotice} onClick={goEventNotice}>
            공지 보기
          </button>
          <button className={styles.confirm} onClick={handleNext}>
            {isLast ? onIsLast : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}
