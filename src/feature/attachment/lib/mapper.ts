const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm', 'wmv'];

export const mapFilesToAttachments = (files: File[]) =>
  files.map((file) => ({
    file,
    fileName: file.name,
    fileComment: '',
    type: getMediaType(file),
  }));

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
