import React from 'react';

import { Icon } from '@/shared/component';
import altImage from '@/assets/images/altImage.png';
import { getSafeSrc } from '@/shared/lib';

import styles from './AttachmentList.module.css';

function AttachmentList({ attachmentsInfo, setAttachmentsInfo }) {
  return (
    <ul className={styles.imageList}>
      {attachmentsInfo.map((att, index) => (
        <li
          key={index}
          className={styles.imageContainer}
          draggable
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', index);
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const draggedIndex = parseInt(
              e.dataTransfer.getData('text/plain'),
              10
            );
            const droppedIndex = index;

            //같은 위치에 드롭했을 때
            if (draggedIndex === droppedIndex) return;

            //다른 위치에 드롭했을 때
            setAttachmentsInfo((prev) => {
              const copy = [...prev];
              const [moved] = copy.splice(draggedIndex, 1);
              copy.splice(droppedIndex, 0, moved);
              return copy;
            });
          }}
        >
          {attachmentsInfo[index].type === 'PHOTO' ? (
            //첨부파일이 이미지일 경우
            <img
              src={getSafeSrc(att)}
              className={styles.image}
              onError={(e) => {
                e.currentTarget.src = altImage;
              }}
              draggable={false}
            />
          ) : (
            //첨부파일이 영상일 경우
            <div className={styles.image}>
              <video
                src={getSafeSrc(att)}
                playsInline
                className={styles.video}
                draggable={false}
                onError={(e) => {
                  const img = document.createElement('img');
                  img.src = altImage;
                  img.className = styles.image;
                  e.currentTarget.replaceWith(img);
                }}
              />
              <Icon
                id='video-fill'
                width={'0.875rem'}
                height={'0.875rem'}
                className={styles.videoIcon}
              />
            </div>
          )}
          <Icon
            id='image-select-bar'
            width={'3rem'}
            height={'9.6rem'}
            fill='white'
            className={styles.imageSelectBar}
          />
        </li>
      ))}
    </ul>
  );
}
export default React.memo(AttachmentList);
