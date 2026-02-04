//이미지*영상 개수 및 용량 제한 정책
export const ATTACHMENT_SIZE_LIMIT = Object.freeze({
  imageFileSize: 7 * 1024 * 1024, //MB
  imageQuantity: 5,
  videoFileSize: 50 * 1024 * 1024,
  videoQuantity: 1,
});
export const ATTACHMENT_EXTENSION_LIMIT = Object.freeze({
  imageExtensions: ['.jpg', '.jpeg', '.png', '.jfif', '.bmp', '.webp'],
  videoExtensions: ['.mp4', '.mov'],
});
