import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  TOAST,
  ATTACHMENT_SIZE_LIMIT,
  ATTACHMENT_EXTENSION_LIMIT,
} from '@/shared/constant';

//첨부파일 확장자가 이미지인지 확인하는 함수
export const isExtImg = (url) => {
  const cleanUrl = url.split('?')[0].toLowerCase();

  return ATTACHMENT_EXTENSION_LIMIT.imageExtensions.some((ext) =>
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

//Date의 시간 정보 꺼내기
export const getLocalDateParts = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ];
};

//첨부파일이 한개일 시 사용하는 함수
export const handleDownload = async (att) => {
  const s3Url = att.url;
  const response = await downloadFromS3(s3Url);

  const [year, month, day, hour, minute, second] = getLocalDateParts();

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isExtImg(s3Url)
      ? `snorose-${year}-${month}-${day}-${hour}_${minute}_${second}.webp`
      : `snorose-${year}-${month}-${day}-${hour}_${minute}_${second}.mp4`;

    // 자동 다운로드 트리거
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // URL 정리
    window.URL.revokeObjectURL(url);
  }

  return true;
};

//다수의 첨부파일을 다운받을때 -> zip으로 묶고 다운받는 함수
export const handleZipDownload = async (urls) => {
  const zip = new JSZip();
  const [year, month, day, hour, minute, second] = getLocalDateParts();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = isExtImg(url)
      ? `snorose-${year}-${month}-${day}-${hour}_${minute}_${second}(${i}).webp`
      : `snorose-${year}-${month}-${day}-${hour}_${minute}_${second}(${i}).mp4`;
    const response = await downloadFromS3(url);
    const blob = await response.blob();
    zip.file(filename, blob);
  }
  const zipContent = await zip.generateAsync({ type: 'blob' });
  saveAs(
    zipContent,
    `snorose-${year}-${month}-${day}-${hour}_${minute}_${second}.zip`
  );

  return true;
};

//첨부파일 정책에 맞는지 확인하는 함수들
export const checkImageQuantity = (orgAtts, newAtts) => {
  if (
    orgAtts.filter((att) => att.type === 'PHOTO').length + newAtts.length >
    ATTACHMENT_SIZE_LIMIT.imageQuantity
  ) {
    throw new Error(TOAST.ATTACHMENT.imageQuantityError);
  }
};
export const checkIfImage = (newAtts) => {
  if ([...newAtts].some((a) => a.type && !a.type.startsWith('image/'))) {
    throw new Error(TOAST.ATTACHMENT.notImageError);
  }
};
export const checkImageSize = (entireAtts, toast) => {
  const filteredAtts = Array.from(entireAtts).filter(
    (file) => file.size <= ATTACHMENT_SIZE_LIMIT.imageFileSize
  );
  if (entireAtts.length !== filteredAtts.length) {
    return TOAST.ATTACHMENT.imageFileSizeError;
  }
};
export const checkVideoQuantity = (orgAtts, newAtts) => {
  if (
    orgAtts.filter((att) => att.type === 'VIDEO').length + newAtts.length >
    ATTACHMENT_SIZE_LIMIT.videoQuantity
  ) {
    throw new Error(TOAST.ATTACHMENT.videoQuantityError);
  }
};
export const checkVideoSize = (entireAtts) => {
  const filteredAtts = Array.from(entireAtts).filter(
    (file) => file.size <= ATTACHMENT_SIZE_LIMIT.videoFileSize
  );
  if (entireAtts.length !== filteredAtts.length) {
    throw new Error(TOAST.ATTACHMENT.videoFileSizeError);
  }
};
export const checkIfVideo = (newAtts) => {
  if ([...newAtts].some((a) => a.type && !a.type.startsWith('video/'))) {
    throw new Error(TOAST.ATTACHMENT.notVideoError);
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
