import { useState } from 'react';

import { IconMultiLogoWithCloud } from '@snorose/icons';

import { BackAppBar } from '@/shared/component';

import {
  Accordion,
  AccordionListItem,
  AccordionTag,
} from '@/feature/home/component';
import {
  ABOUT_SNOROSE,
  SNOROSE_HISTORY,
  SNOROSE_MEMBERSHIP_LEVEL,
} from '@/feature/home/constant';
import HALL_OF_FAME_ADMINS from '@/feature/home/data/HallOfFrameAdmins.json';

import HALL_OF_FAME from '@/assets/images/hallOfFame.svg';

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
        <img src={HALL_OF_FAME} alt='hallOfFame' />
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
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.container}>
      <BackAppBar hasMenu />
      <IconMultiLogoWithCloud className={styles.logo} width={221} height={25} />
      <div className={styles.accordionList}>
        {accordionItems.map((item, index) => (
          <Accordion
            key={item.title}
            title={item.title}
            isOpen={openIndex === index}
            onClick={() => toggle(index)}
          >
            {item.content}
          </Accordion>
        ))}
      </div>
    </section>
  );
}
