import { IconMultiCloudBlack, IconMultiCloudLogo } from '@snorose/icons';

import { Badge } from '@/shared/component';

import styles from './AccordionListItem.module.css';

export default function AccordionListItem({ list, listName }) {
  return (
    <ul className={styles.list}>
      {list.map((content) => (
        <li key={content.name} className={styles.item}>
          {content.name === '블랙리스트' ? (
            <IconMultiCloudBlack
              className={styles.icon}
              width={28}
              height={17}
              role='img'
              aria-label='블랙로고'
            />
          ) : (
            <IconMultiCloudLogo
              className={styles.icon}
              width={28}
              height={17}
              role='img'
              aria-label='로고'
            />
          )}
          <div className={styles.itemContainer}>
            <span className={styles.name}>
              {content.name}
              {content.badge && (
                <Badge userRoleId={content.role} width={16} height={16} />
              )}
            </span>
            {listName === 'SNOROSE_HISTORY' ? <p>-</p> : <p>:</p>}
            <span className={styles.description}>{content.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
