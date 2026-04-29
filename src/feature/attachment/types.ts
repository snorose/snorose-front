export type Attachment = {
  id: number;
  url: string;
  type: 'PHOTO' | 'VIDEO' | 'FILE';
  fileName: string;
  fileComment: string;
};

export type UploadFile = {
  id: string;
  file: File;
};
