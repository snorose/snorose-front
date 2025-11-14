import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  TOAST,
  ATTACHMENT_SIZE_LIMIT,
  ATTACHMENT_EXTENTION_LIMIT,
} from '@/shared/constant';

//첨부파일 확장자가 이미지인지 확인하는 함수
export const isExtImg = (url) => {
  const cleanUrl = url.split('?')[0].toLowerCase();

  return ATTACHMENT_EXTENTION_LIMIT.imageExtentions.some((ext) =>
    cleanUrl.endsWith(ext.toLowerCase())
  );
};

//s3 url로부터 첨부파일 다운받는 함수
export const downloadFromS3 = async (s3Url) =>
  await fetch(s3Url, {
    mode: 'cors',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

//첨부파일이 한개일 시 사용하는 함수
export const handleDownload = async (s3Url) => {
  const response = await downloadFromS3(s3Url);

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isExtImg(s3Url) ? '첨부파일.webp' : '첨부파일.mp4';

    // 자동 다운로드 트리거
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // URL 정리
    window.URL.revokeObjectURL(url);
  }
};

//다수의 첨부파일을 다운받을때 -> zip으로 묶고 다운받는 함수
export const handleZipDownload = async (urls) => {
  const zip = new JSZip();
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = isExtImg(url) ? `첨부파일${i}.webp` : `첨부파일${i}.mp4`;
    const response = await downloadFromS3(url);
    const blob = await response.blob();
    zip.file(filename, blob);
  }
  const zipContent = await zip.generateAsync({ type: 'blob' });
  saveAs(zipContent, 'attachments.zip');
};

//첨부파일 정책에 맞는지 확인하는 함수들
export const checkImageQuantity = (orgAtts, newAtts, toast) => {
  if (
    orgAtts.filter((att) => att.type === 'PHOTO').length + newAtts.length >
    ATTACHMENT_SIZE_LIMIT.imageQuantity
  ) {
    toast({ message: TOAST.ATTACHMENT.imageQuantityError, variant: 'info' });
    throw new Error('이미지 개수 초과');
  }
};
export const checkImageSize = (entireAtts, filteredAtts, toast) => {
  if (entireAtts.length !== filteredAtts.length) {
    toast({ message: TOAST.ATTACHMENT.imageFileSizeError, variant: 'info' });
    throw new Error('이미지 용량 초과');
  }
};
export const checkVideoQuantity = (orgAtts, newAtts, toast) => {
  if (
    orgAtts.filter((att) => att.type === 'VIDEO').length + newAtts.length >
    ATTACHMENT_SIZE_LIMIT.videoQuantity
  ) {
    toast({ message: TOAST.ATTACHMENT.videoQuantityError, variant: 'info' });
    throw new Error('비디오 개수 초과');
  }
};
export const checkVideoSize = (entireAtts, filteredAtts, toast) => {
  if (entireAtts.length !== filteredAtts.length) {
    toast({ message: TOAST.ATTACHMENT.videoFileSizeError, variant: 'info' });
    throw new Error('비디오 용량 초과');
  }
};

//AttachmentList에 createObjectURL로 인해 에러가 나지 않게 src가 안전한지 확인하기
export const getSafeSrc = (att) => {
  // 1) 백엔드에 이미 올려서 url이 존재하는 첨부파일들은 url 리턴하기
  if (att.url) return att.url;
  // 2) file이 존재하지만 Blob이 아니면 올바른 타입이 아니니 null 리턴하기
  if (att.file && !(att.file instanceof Blob)) return null;
  // 3) file이 Blob이지만 생성이 안되면 null 리턴하기
  try {
    return att.file ? URL.createObjectURL(att.file) : null;
  } catch (err) {
    return null;
  }
};
