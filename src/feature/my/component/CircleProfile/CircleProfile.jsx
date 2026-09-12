import { IllustrationDefaultProfile } from '@snorose/icons';

import styles from './CircleProfile.module.css';

export default function CircleProfile({ userInfo }) {
  return (
    <div className={styles.profileImage}>
      <IllustrationDefaultProfile
        role='img'
        aria-label={`${userInfo?.userName} 프로필`}
      />
    </div>
  );
}
