import InputLayout from '@/shared/component/form/input/InputLayout';

export default function EmailInput({
  id,
  placeholder,
  value,
  onChange,
  status = 'default',
}) {
  return (
    <InputLayout status={status}>
      <input
        id={id}
        type='email'
        inputMode='email'
        spellCheck='false'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputLayout>
  );
}
