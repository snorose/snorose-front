import style from './NewButton.module.css';

// interface ButtonProps {
//   size?: 'small' | 'medium';
//   variant?: 'solid' | 'outlined' | 'outlinedSecondary';
//   disabled?: boolean;
//   children: React.ReactNode;
// }

const SIZE = {
  small: style.small,
  medium: style.medium,
};

const VARIANT = {
  solid: style.solid,
  outlined: style.outlined,
  outlinedSecondary: style.outlinedSecondary,
};

export default function Button({
  size = 'medium',
  variant = 'solid',
  onClick,
  disabled = false,
  children,
}) {
  return (
    <button
      className={`${style.button} ${SIZE[size]} ${VARIANT[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
