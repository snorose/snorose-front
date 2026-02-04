import InputLayout from '@/shared/component/form/input/InputLayout';

export default function TextInput({
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
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputLayout>
  );
}
