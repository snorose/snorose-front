import { createContext, useContext, useId } from 'react';

import styles from './TextFieldBlue.module.css';

interface FieldContextType {
  id: string;
}

const FieldContext = createContext<FieldContextType | undefined>(undefined);

const useFieldContext = () => {
  const context = useContext(FieldContext);
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
}: {
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const { id } = useFieldContext();

  return (
    <input
      className={styles.input}
      id={id}
      type='text'
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

TextFieldBlue.Label = Label;
TextFieldBlue.Input = Input;

export default TextFieldBlue;
