import { createContext, useContext, useId } from 'react';

import TextareaAutosize from 'react-textarea-autosize';

import styles from './TextareaFieldBlue.module.css';

interface FieldContextType {
  id: string;
}

interface TextareaProps {
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
}

const FieldContext = createContext<FieldContextType | undefined>(undefined);

const useFieldContext = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error(
      'TextareaField sub-components must be used within a TextareaField'
    );
  }

  return context;
};

function TextareaFieldBlue({ children }: { children: React.ReactNode }) {
  const id = useId();

  return (
    <FieldContext.Provider value={{ id }}>
      <div className={styles.field}>{children}</div>
    </FieldContext.Provider>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  const { id } = useFieldContext();

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
  maxLength = 2000,
  minRows = 5,
  maxRows = 10,
}: TextareaProps) {
  const { id } = useFieldContext();

  return (
    <div className={styles.textarea}>
      <TextareaAutosize
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        minRows={minRows}
        maxRows={maxRows}
      />
      <div>{value.length}/2000</div>
    </div>
  );
}

TextareaFieldBlue.Label = Label;
TextareaFieldBlue.Input = Input;

export default TextareaFieldBlue;
