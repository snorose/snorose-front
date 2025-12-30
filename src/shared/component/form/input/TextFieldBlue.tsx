import { createContext, useContext, useId } from 'react';

import styles from './TextFieldBlue.module.css';

interface TextInputBlueContextType {
  id: string;
}

const TextFieldBlueContext = createContext<
  TextInputBlueContextType | undefined
>(undefined);

const useTextFieldBlueContext = () => {
  const context = useContext(TextFieldBlueContext);
  if (!context) {
    throw new Error(
      'TextFieldBlue sub-components must be used within a TextFieldBlue'
    );
  }
  return context;
};

function TextFieldBlue({ children }: { children: React.ReactNode }) {
  const id = useId();

  return (
    <TextFieldBlueContext.Provider value={{ id }}>
      <div className={styles.field}>{children}</div>
    </TextFieldBlueContext.Provider>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  const { id } = useTextFieldBlueContext();

  return (
    <label className={styles.label} htmlFor={id}>
      {children}
    </label>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { id } = useTextFieldBlueContext();

  return (
    <input
      className={styles.input}
      id={id}
      type='text'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

TextFieldBlue.Label = Label;
TextFieldBlue.Input = Input;

export default TextFieldBlue;
