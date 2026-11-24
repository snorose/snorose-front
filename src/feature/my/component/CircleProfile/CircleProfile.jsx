import { IllustrationDefaultProfile } from '@snorose/icons';

import santaHat from './assets/il-santa-hat.svg';
import styles from './CircleProfile.module.css';

const IS_CHRISTMAS_EVENT = true;

export default function CircleProfile({ userInfo }) {
  return (
    <div className={styles.profileImage}>
      <IllustrationDefaultProfile
        role='img'
        aria-label={`${userInfo?.userName} 프로필`}
      />

      {IS_CHRISTMAS_EVENT && (
        <img
          src={santaHat}
          className={styles.santaHat}
          alt='임시 산타 모자'
          aria-hidden='true'
        />
      )}
    </div>
  );
}
