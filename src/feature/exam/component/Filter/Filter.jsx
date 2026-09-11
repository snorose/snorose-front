import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IconChevronDown, IconChevronUp } from '@snorose/icons';

import XIconsmall from '@/assets/icons/Xsmall.svg?react';

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
        {isOpen ? (
          <IconChevronUp width={18} height={18} color='var(--blue-4)' />
        ) : (
          <IconChevronDown width={18} height={18} color='var(--blue-4)' />
        )}
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
            <XIconsmall width={8} height={8} />
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
