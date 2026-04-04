import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Icon } from '@/shared/component';

import styles from './Filter.module.css';

export default function Filter({ filterKey, options, placeholder }) {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOption = searchParams.get(filterKey);
  const { name: selectedOptionName } =
    options.find(({ id }) => id.toString() === selectedOption) ?? {};

  const updateOption = (event) => {
    const id = event.target.dataset.id;

    searchParams.set(filterKey, id);
    setSearchParams(searchParams);
  };

  const deleteOption = () => {
    searchParams.delete(filterKey);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const toggle = (event) => {
      if (ref.current.contains(event.target)) {
        setIsOpen((prev) => !prev);
      } else {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', toggle);

    return () => {
      document.removeEventListener('click', toggle);
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.filter} ${isOpen && styles.open}`}>
      <div className={`${styles.display}`}>
        <Icon
          id={isOpen ? 'angle-up-blue' : 'angle-down-blue'}
          width={8}
          height={5}
        />
        <span className={styles.displayOption}>
          {selectedOptionName ?? placeholder}
        </span>
        {selectedOption && (
          <button
            className={styles.clearIcon}
            aria-label='선택한 필터 해제'
            onClick={(e) => {
              e.stopPropagation();
              deleteOption();
            }}
          >
            <Icon id='x' width={10} height={10} />
          </button>
        )}
      </div>
      <ul className={styles.list}>
        {options.map(({ id, name }) => (
          <li
            className={styles.option}
            key={id}
            data-id={id}
            onClick={updateOption}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
