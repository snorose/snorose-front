import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from '@/feature/attachment/constant';
import type { UploadFile } from '@/feature/attachment/types';

export const mapFileToAttachment = ({ file }: UploadFile) => ({
  file,
  id: null,
  url: '',
  fileName: file.name,
  fileComment: '',
  type: getMediaType(file),
});

const getMediaType = (file: File): 'PHOTO' | 'VIDEO' => {
  const { type: mimeType, name: fileName } = file;

  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'PHOTO';
    if (mimeType.startsWith('video/')) return 'VIDEO';
  }

  const extension = fileName.split('.').pop().toLowerCase();

  if (IMAGE_EXTENSIONS.includes(extension)) return 'PHOTO';
  if (VIDEO_EXTENSIONS.includes(extension)) return 'VIDEO';
};
