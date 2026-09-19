import { useState } from 'react';

import { IconEye, IconEyeFill } from '@snorose/icons';

import InputLayout from '@/shared/component/form/input/InputLayout';

import styles from './PasswordInput.module.css';

export default function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
  status = 'default',
}) {
  const [visible, setVisible] = useState(false);
  const fillColor = {
    valid: '#00368E',
    error: '#FF4B6C',
  }[status];
  const IconComponent = visible ? IconEyeFill : IconEye;

  return (
    <InputLayout status={status}>
      <input
        id={id}
        type={visible ? 'type' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <IconComponent
          className={styles.icon}
          color={fillColor}
          width={24}
          height={24}
          onClick={() => setVisible((prev) => !prev)}
        />
      )}
    </InputLayout>
  );
}
