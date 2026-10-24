import style from './CategoryTab.module.css';

export default function CategoryTab({ label, isSelected = false, onClick }) {
  const selectedStyle = isSelected ? style.selected : style.unselected;

  return (
    <div className={`${style.tab} ${selectedStyle}`} onClick={onClick}>
      {label}
    </div>
  );
}
