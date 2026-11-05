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
      toast.error(TOAST.EVENT.EMPTY);
      return;
    }
    if (!isUrlValid(data.link, { open: true })) {
      toast.error(TOAST.EVENT.FAIL);
    }
  };

  const isLinkField = name === 'link';

  return (
    <div>
      <div className={isLinkField ? styles.linkArea : undefined}>
        <TextareaAutosize
          className={`${styles.textarea} ${error ? styles.error : ''}`}
          placeholder={placeholder}
          aria-label={label}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          {...props}
        />
        {isLinkField && (
          <PrimaryButton
            type='button'
            className={styles.button}
            onClick={handleCheckLink}
            disabled={!data.link?.trim()}
          >
            미리보기
          </PrimaryButton>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
