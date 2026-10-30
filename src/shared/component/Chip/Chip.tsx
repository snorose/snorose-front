import styles from './Chip.module.css';

type ChipPropsType = {
  name: string;
  variant: 'grey' | 'gradient';
  size?: 'md' | 'sm';
};

export default function Chip({ name, variant, size = 'md' }: ChipPropsType) {
  return (
    <div className={`${styles.container} ${styles[variant]} ${styles[size]}`}>
      {name}
    </div>
  );
}
