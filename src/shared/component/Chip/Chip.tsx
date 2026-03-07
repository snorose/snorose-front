import styles from './Chip.module.css';

type ChipPropsType = {
  name: string;
  variant: 'grey' | 'gradient';
};

export default function Chip({ name, variant }: ChipPropsType) {
  return <div className={`${styles.container} ${styles[variant]}`}>{name}</div>;
}
