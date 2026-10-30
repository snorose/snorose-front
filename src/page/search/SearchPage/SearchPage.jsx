import { useLocation, useSearchParams } from 'react-router-dom';

import { BackAppBar } from '@/shared/component';

import { Search, SearchResultListSuspense } from '@/feature/search/component';
import { PLACEHOLDER } from '@/feature/search/constant';

import styles from './SearchPage.module.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const paramsLength = Object.keys(params).length;

  const { pathname } = useLocation();
  const current = pathname.split('/')[2];

  return (
    <div className={styles.container}>
      <BackAppBar hasSearchInput={true}>
        <Search placeholder={PLACEHOLDER[current]} replace />
      </BackAppBar>

      {paramsLength > 0 && <SearchResultListSuspense />}
    </div>
  );
}
