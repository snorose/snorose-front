import { useState } from 'react';

import { Icon } from '@/shared/component';

import styles from './PwInput.module.css';

const PwInput = ({
  title = '',
  placeholder = '',
  value = '',
  onChange,
  errorMessage = '',
  isStatic = false,
}) => {
  const [passwordType, setPasswordType] = useState({
    type: 'password',
    visible: false,
  });

  const handlePasswordType = () => {
    setPasswordType((prev) => ({
      type: prev.visible ? 'password' : 'text',
      visible: !prev.visible,
    }));
  };

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const iconColor = errorMessage
    ? '#ff4b6c'
    : value && !errorMessage && !isStatic
      ? '#00368e'
      : '#898989';

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div
        className={`${styles.inputWrapper} ${
          !isStatic && value && !errorMessage ? styles.rightInputWrapper : ''
        } ${!isStatic && errorMessage ? styles.errorInputWrapper : ''}`}
      >
        <input
          type={passwordType.type}
          className={`${styles.inputText} ${
            !isStatic && value && !errorMessage ? styles.rightInputText : ''
          } ${!isStatic && errorMessage ? styles.errorInputText : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
        />
        <Icon
          id={passwordType.visible ? 'closed-eye' : 'opened-eye'}
          width={18}
          height={13}
          fill={iconColor}
          onClick={handlePasswordType}
        />
      </div>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default PwInput;
