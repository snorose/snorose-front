import {
  IllustrationHallOfFame,
  IllustrationLogoAboutSnoroseCloud,
} from '@snorose/icons';
import { IconMultiCloudBlack, IconMultiCloudLogo } from '@snorose/icons';

import { Accordion, BackAppBar } from '@/shared/component';
import { Badge } from '@/shared/component';

import {
  ABOUT_SNOROSE,
  SNOROSE_HISTORY,
  SNOROSE_MEMBERSHIP_LEVEL,
} from '@/feature/home/constant';
import HALL_OF_FAME_ADMINS from '@/feature/home/data/HallOfFrameAdmins.json';

import styles from './AboutPage.module.css';

const accordionItems = [
  {
    title: '스노로즈 소개',
    content: <pre className={styles.aboutUs}>{ABOUT_SNOROSE}</pre>,
  },
  {
    title: '스노로즈 연혁',
    content: (
      <AccordionListItem list={SNOROSE_HISTORY} listName='SNOROSE_HISTORY' />
    ),
  },
  {
    title: '회원 등급 설명',
    content: (
      <AccordionListItem
        list={SNOROSE_MEMBERSHIP_LEVEL}
        listName='SNOROSE_MEMBERSHIP_LEVEL'
      />
    ),
  },
  {
    title: '명예의 전당',
    content: (
      <section className={styles.hallOfFame}>
        <IllustrationHallOfFame
          className={styles.hallOfFameImage}
          role='img'
          aria-label='명예의 전당'
        />
        <div className={styles.tags}>
          {HALL_OF_FAME_ADMINS.map((admin, index) => (
            <AccordionTag key={`${admin.nickname}-${index}`} admin={admin} />
          ))}
        </div>
      </section>
    ),
  },
];

export default function AboutPage() {
  return (
    <section className={styles.container}>
      <BackAppBar hasMenu />
      <IllustrationLogoAboutSnoroseCloud
        className={styles.logo}
        width={221}
        height={25}
      />
      <div className={styles.accordionList}>
        <Accordion>
          {accordionItems.map((item, index) => (
            <Accordion.Item key={item.title} id={item.title}>
              <Accordion.Trigger>{item.title}</Accordion.Trigger>
              <Accordion.Content>{item.content}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function AccordionListItem({ list, listName }) {
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

function AccordionTag({ admin }) {
  const { nickname, role, team, position, studentInformation } = admin;
  const roleArray = role ? [role] : [];
  const teamArray = team ?? [];

  return (
    <div className={styles.tag}>
      <div className={styles.top}>
        <span className={styles.nickname}>{nickname}</span>
        {(role || team || position) && (
          <span className={styles.title}>
            {`${[...roleArray, ...teamArray].join(', ')}`}
            {position && `(${position.join(', ')})`}
          </span>
        )}
      </div>
      <div className={styles.bottom}>
        <p className={styles.studentInfo}>{studentInformation}</p>
      </div>
    </div>
  );
}
