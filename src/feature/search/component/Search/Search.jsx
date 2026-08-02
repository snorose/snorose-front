import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Icon } from '@/shared/component';

import styles from './Search.module.css';

export default function Search({
  className = '',
  placeholder,
  to,
  replace = false,
}) {
  const ref = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  useEffect(() => {
    if (ref.current) {
      ref.current.value = keyword;
    }
  }, [keyword]);

  const handleSearch = (value) => {
    const trimmedKeyword = value.trim();

    if (trimmedKeyword === '') {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('keyword', trimmedKeyword);

    navigate(
      {
        pathname: to ?? location.pathname,
        search: nextParams.toString(),
      },
      { replace }
    );
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Icon id='search' width={14} height={14} />
      <input
        ref={ref}
        className={styles.search}
        type='text'
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') {
            return;
          }

          handleSearch(event.target.value);
        }}
      />
    </div>
  );
}
