import { useToast } from '@/shared/hook';
import { ATTACHMENT_SIZE_LIMIT } from '@/shared/constant';
import {
  checkIfImage,
  checkImageQuantity,
  checkImageSize,
  checkIfVideo,
  checkVideoQuantity,
  checkVideoSize,
} from '@/feature/attachment/lib';

export function useAttachmentUpload({ attachmentsInfo, setAttachmentsInfo }) {
  const { toast } = useToast();
  const changeImageUpload = (e) => {
    const newFiles = e.target.files;
    const newFileArray = Array.from(newFiles).filter(
      (file) => file.size <= ATTACHMENT_SIZE_LIMIT.imageFileSize
    );

    try {
      checkIfImage(newFiles);
      checkImageQuantity(attachmentsInfo, newFiles);

      const warningMessage = checkImageSize(newFiles);
      if (warningMessage) {
        toast({
          message: warningMessage,
          variant: 'error',
        });
      }
    } catch (err) {
      toast({ message: err.message, variant: 'error' });
      return;
    }

    const mappedFiles = newFileArray.map((file) => ({
      fileName: file.name,
      fileComment: '',
      fileType: file.type,
      type: 'PHOTO',
      file,
      id: '',
    }));

    setAttachmentsInfo((prev) => [...prev, ...mappedFiles]);
    e.target.value = null;
  };

  const changeVideoUpload = (e) => {
    const newFiles = e.target.files;
    const newFileArray = Array.from(newFiles).filter(
      (file) => file.size <= ATTACHMENT_SIZE_LIMIT.videoFileSize
    );

    try {
      checkIfVideo(newFiles);
      checkVideoQuantity(attachmentsInfo, newFiles);
      checkVideoSize(newFiles);
    } catch (err) {
      toast({ message: err.message, variant: 'error' });
      return;
    }

    const mappedFiles = newFileArray.map((file) => ({
      fileName: file.name,
      fileComment: '',
      fileType: file.type,
      type: 'VIDEO',
      file,
      id: '',
    }));

    setAttachmentsInfo((prev) => [...prev, ...mappedFiles]);
    e.target.value = null;
  };

  return {
    changeImageUpload,
    changeVideoUpload,
  };
}
