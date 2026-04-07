export type Attachment = {
  id: number | null;
  url: string;
  type: 'PHOTO' | 'VIDEO' | 'FILE';
  fileName: string;
  fileComment: string;
};
