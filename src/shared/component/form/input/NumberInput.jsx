import { isNumber } from '@/shared/lib';
import InputLayout from '@/shared/component/form/input/InputLayout';

export default function NumberInput({
  id,
  placeholder,
  value,
  onChange,
  status = 'default',
  maxLength,
}) {
  return (
    <InputLayout status={status}>
      <input
        id={id}
        type='text'
        inputMode='numeric'
        {...(maxLength ? { maxLength } : {})}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const { value } = e.target;

          if (isNumber(value) || value === '') {
            onChange(value);
          }
        }}
      />
    </InputLayout>
  );
}
