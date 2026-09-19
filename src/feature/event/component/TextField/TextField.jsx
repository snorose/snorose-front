import TextareaAutosize from 'react-textarea-autosize';

import { PrimaryButton } from '@/shared/component';
import { TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { isUrlValid } from '@/feature/event/lib';

import styles from './TextField.module.css';

export default function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  data = {},
  ...props
}) {
  const { toast } = useToast();

  const handleCheckLink = () => {
    if (!data.link?.trim()) {
      toast({ message: TOAST.EVENT.EMPTY, variant: 'error' });
      return;
    }
    if (!isUrlValid(data.link, { open: true })) {
      toast({ message: TOAST.EVENT.FAIL, variant: 'error' });
    }
  };

  const isLinkField = label === '연계 링크';

  return (
    <div>
      <div className={isLinkField ? styles.linkArea : undefined}>
        <TextareaAutosize
          className={`${styles.textarea} ${error ? styles.error : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          {...props}
        />
        {isLinkField && (
          <PrimaryButton className={styles.button} onClick={handleCheckLink}>
            미리
            <br />
            보기
          </PrimaryButton>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
