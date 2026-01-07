import { React, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper/modules';

import { useToast } from '@/shared/hook';
import { Icon, ChoiceModal } from '@/shared/component';
import { handleDownload, handleZipDownload } from '@/shared/lib';
import altImage from '@/assets/images/altImage.png';

import styles from './FullScreenAttachment.module.css';
import 'swiper/css';
import 'swiper/swiper-bundle.css';

export default function FullScreenAttachment({
  attachmentUrls,
  createdAt,
  clickedImageIndex,
  setClickedImageIndex,
}) {
  const urls = attachmentUrls.map((att) => att.url);
  const { toast } = useToast();
  const paginationRef = useRef(null);
  const swiperRef = useRef(null);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.topContainer}>
        <Icon
          id={'x'}
          width={'1.8rem'}
          height={'1.8rem'}
          className={styles.x}
          onClick={() => {
            //clickedImageIndex가 0이야지 FullScreenAttachment가 보이지 않음 (PostPage.jsx 분기처리 확인하기)
            setClickedImageIndex(0);
          }}
        />
        <p
          className={`${styles.pagination} swiper-custom-pagination`}
          ref={paginationRef}
        ></p>
        <Icon
          id={'download'}
          width={'2.4rem'}
          height={'2.4rem'}
          className={styles.download}
          onClick={() => {
            setIsChoiceModalOpen(true);
          }}
        />
      </div>
      <div className={styles.bodyContainer}>
        <Swiper
          className={styles.attachmentsContainer}
          modules={[Pagination, Keyboard]}
          slidesPerView={1}
          initialSlide={clickedImageIndex - 1}
          keyboard={{
            enabled: true,
            onlyInViewport: false,
          }}
          pagination={{
            el: '.swiper-custom-pagination',
            type: 'fraction',
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChangeTransitionStart={(swiper) => {
            const videoToPause =
              swiper.slides[swiper.previousIndex].querySelector('video');
            if (videoToPause) videoToPause.pause();
          }}
        >
          {attachmentUrls.map((att, index) => (
            <SwiperSlide key={index} className={styles.attachmentsSlide}>
              {att.type === 'PHOTO' ? (
                <img
                  src={att.url}
                  className={styles.attachment}
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.src = altImage;
                  }}
                />
              ) : (
                <div className={styles.videoWrapper}>
                  <video
                    src={att.url}
                    className={`${styles.attachment} ${styles.videoElement}`}
                    draggable={false}
                    controls
                    onLoadedMetadata={() => {
                      // 해당 코드가 없을시 전체화면 슬라이드 시작점을 영상으로 잡으면 영상의 위치가 이상함
                      swiperRef.current?.updateAutoHeight();
                    }}
                    onDragStart={(e) => {
                      e.preventDefault();
                    }}
                    onError={(e) => {
                      const img = document.createElement('img');
                      img.src = altImage;
                      img.className = styles.attachment;
                      e.currentTarget.replaceWith(img);
                    }}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ChoiceModal
        id='save-image'
        isOpen={isChoiceModalOpen}
        closeFn={() => setIsChoiceModalOpen(false)}
        optionFns={[
          async () => {
            //게시글 사진 전체 저장 - 전체 파일들을 zip 해서 리턴하기
            //attachmentUrls안에 있는 모든 url을 zip 해서 한 파일로 만들고, 그걸 다운로드 받게 하기
            try {
              setIsChoiceModalOpen(false);

              await handleZipDownload(urls, createdAt);
              toast({
                message: '첨부파일 저장이 완료되었어요.',
                variant: 'success',
              });
            } catch (e) {
              toast({
                message: '다운로드에 문제가 발생했습니다. 다시 시도해주세요.',
                variant: 'error',
              });
            }
          },
          async () => {
            //이 사진만 저장
            //attachmentUrls[currentIndex]
            try {
              setIsChoiceModalOpen(false);

              const currentIndex =
                paginationRef.current?.textContent.split('/')[0] - 1;
              await handleDownload(attachmentUrls[currentIndex], createdAt);
              toast({
                message: '첨부파일 저장이 완료되었어요.',
                variant: 'success',
              });
            } catch (e) {
              toast({
                message: '다운로드에 문제가 발생했습니다. 다시 시도해주세요.',
                variant: 'error',
              });
            }
          },
        ]}
      />
    </div>
  );
}
