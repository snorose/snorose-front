import { useRef } from 'react';

import { IconMultiVideo } from '@snorose/icons';
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import altImage from '@/assets/images/altImage.png';

import styles from './AttachmentSwiper.module.css';

export default function AttachmentSwiper({ data, setClickedImageIndex }) {
  const scrollbarRef = useRef(null);
  return (
    <div className={styles.swiperContainer}>
      <Swiper
        className={styles.attachmentsContainer}
        modules={[Scrollbar]}
        slidesPerView={'auto'}
        spaceBetween={8}
        scrollbar={{
          el: scrollbarRef.current,
          draggable: true,
          dragSize: 50,
        }}
        onSwiper={(swiper) => {
          // Manually update scrollbar element after mount
          swiper.params.scrollbar.el = scrollbarRef.current;
          swiper.scrollbar.init();
          swiper.scrollbar.updateSize();
        }}
        freeMode={true}
        loop={false}
      >
        {data.attachments.map((item, index) => (
          <SwiperSlide key={index} className={styles.attachmentSlide}>
            <div className={styles.attchmentDiv}>
              {item.type === 'PHOTO' ? (
                <img
                  src={item.url}
                  className={styles.attachment}
                  draggable={false}
                  onClick={() => {
                    //이미지 클릭 시 전체화면 보기 가능
                    setClickedImageIndex(index + 1);
                  }}
                  onError={(e) => {
                    e.currentTarget.src = altImage;
                  }}
                />
              ) : (
                <div
                  onClick={() => {
                    //이미지 클릭 시 전체화면 보기 가능
                    setClickedImageIndex(index + 1);
                  }}
                >
                  <video
                    src={item.url}
                    className={styles.attachment}
                    draggable={false}
                    onError={(e) => {
                      const img = document.createElement('img');
                      img.src = altImage;
                      img.className = styles.attachment;
                      e.currentTarget.replaceWith(img);
                    }}
                  />
                  <IconMultiVideo
                    className={styles.videoIcon}
                    width={32}
                    height={32}
                  />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div ref={scrollbarRef} className={styles.customScrollbar} />
    </div>
  );
}
