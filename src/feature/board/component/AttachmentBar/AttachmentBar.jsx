import { React, useRef, useState } from 'react';

import { Icon } from '@/shared/component';
import { useToast } from '@/shared/hook';
import {
  ATTACHMENT_SIZE_LIMIT,
  ATTACHMENT_EXTENSION_LIMIT,
} from '@/shared/constant';
import {
  checkImageQuantity,
  checkImageSize,
  checkIfImage,
  checkVideoQuantity,
  checkVideoSize,
  checkIfVideo,
} from '@/shared/lib';

import styles from './AttachmentBar.module.css';

export default function AttachmentBar({ attachmentsInfo, setAttachmentsInfo }) {
  const { toast } = useToast();
  const img = useRef();
  const vid = useRef();

  //이미지*영상 첨부 버튼의 UI 상태를 좌우함
  const [isImageIconHighlighted, setIsImageIconHighlighted] = useState(false);
  const [isVideoIconHighlighted, setIsVideoIconHighlighted] = useState(false);

  const changeImageUpload = async (e) => {
    const newFiles = e.target.files;
    const newFileArray = Array.from(newFiles).filter(
      (file) => file.size <= ATTACHMENT_SIZE_LIMIT.imageFileSize
    );

    try {
      //이미지 확장자 확인
      checkIfImage(newFiles, toast);
      //이미지 첨부 개수 제한
      checkImageQuantity(attachmentsInfo, newFiles, toast);
      //이미지 용량 제한
      checkImageSize(newFiles, newFileArray, toast);
    } catch (e) {
      return;
    }

    //새로 선택한 이미지들을 attachmentsInfo 리스트 맨 뒤에 추가해주기
    const mappedFiles = newFileArray.map((file) => ({
      fileName: file.name,
      fileComment: '',
      fileType: file.type,
      type: 'PHOTO',
      file: file,
      id: '',
    }));
    setAttachmentsInfo((prev) => [...prev, ...mappedFiles]);

    //같은 파일 선택할 시 함수가 트리거되지 않는 것을 방지함
    e.target.value = null;
  };

  const changeVideoUpload = async (e) => {
    const newFiles = e.target.files;
    const newFileArray = Array.from(newFiles).filter(
      (file) => file.size <= ATTACHMENT_SIZE_LIMIT.videoFileSize
    );

    try {
      //영상 확장자 확인
      checkIfVideo(newFiles, toast);
      //영상 첨부 개수 제한
      checkVideoQuantity(attachmentsInfo, newFiles, toast);
      //영상 용량 제한
      checkVideoSize(newFiles, newFileArray, toast);
    } catch (e) {
      return;
    }

    //새로 선택한 영상들을 attachmentsInfo 리스트 맨 뒤에 추가해주기
    const mappedFiles = newFileArray.map((file) => ({
      fileName: file.name,
      fileComment: '',
      fileType: file.type,
      type: 'VIDEO',
      file: file,
      id: '',
    }));
    setAttachmentsInfo((prev) => [...prev, ...mappedFiles]);

    //같은 파일 선택할 시 함수가 트리거되지 않는 것을 방지함
    e.target.value = null;
  };

  return (
    <div className={styles.bar}>
      <div className={styles.attachmentBar}>
        <Icon
          id={isImageIconHighlighted ? 'image-fill' : 'image'}
          width={24}
          height={24}
          className={styles.image}
          onClick={() => {
            img.current.click();
          }}
          onPointerEnter={() => setIsImageIconHighlighted(true)}
          onPointerLeave={() => setIsImageIconHighlighted(false)}
        />
        <input
          type='file'
          accept={ATTACHMENT_EXTENSION_LIMIT.imageExtensions.join(', ')}
          className={styles.imageInput}
          ref={img}
          onChange={changeImageUpload}
          multiple
        />
        <Icon
          id={isVideoIconHighlighted ? 'video-fill' : 'video'}
          width={24}
          height={24}
          className={styles.image}
          onClick={() => {
            vid.current.click();
          }}
          onPointerEnter={() => setIsVideoIconHighlighted(true)}
          onPointerLeave={() => setIsVideoIconHighlighted(false)}
        />
        <input
          type='file'
          accept={ATTACHMENT_EXTENSION_LIMIT.videoExtensions.join(', ')}
          className={styles.videoInput}
          ref={vid}
          onChange={changeVideoUpload}
          multiple
        />
      </div>
    </div>
  );
}
