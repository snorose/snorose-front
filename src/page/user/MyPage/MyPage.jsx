import { useAuth } from '@/shared/hook';

import {
  AccountTab,
  ActivityTab,
  CircleProfile,
  MyInfo,
  PolicyTab,
  TopOverlay,
} from '@/feature/my/component';
import { useTabView } from '@/feature/my/hook';

import styles from './MyPage.module.css';

const TABS = [
  { id: 'account', name: '계정 정보' },
  { id: 'activity', name: '내 활동' },
  { id: 'policy', name: '이용 안내' },
];

export default function MyPage() {
  const { userInfo, status } = useAuth();
  const { TabView, changeTabView, currentTabViewId } = useTabView('account');

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <section className={styles.myPage}>
      <TopOverlay />
      <CircleProfile userInfo={userInfo} />

      <div className={styles.myPageLower}>
        <MyInfo userInfo={userInfo} />
        <div className={styles.tabMenu}>
          {TABS.map(({ id, name }) => (
            <div
              key={id}
              className={`${styles.tab} ${currentTabViewId === id && styles.active}`}
              onClick={() => changeTabView(id)}
            >
              {name}
            </div>
          ))}
        </div>

        <TabView>
          <TabView.View view='account'>
            <AccountTab />
          </TabView.View>
          <TabView.View view='activity'>
            <ActivityTab userInfo={userInfo} />
          </TabView.View>
          <TabView.View view='policy'>
            <PolicyTab />
          </TabView.View>
        </TabView>
      </div>
    </section>
  );
}
