import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { IconMultiLogo } from '@snorose/icons';

import {
  FOOTER_CONTACT_ITEMS,
  FOOTER_MENUS,
  FOOTER_SNS_LINKS,
  TOAST,
} from '@/shared/constant';
import { useToast } from '@/shared/hook';

import style from './Footer.module.css';

export default function Footer() {
  const { toast } = useToast();

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({ message: TOAST.COPY_AND_PASTE.success, variant: 'success' });
      })
      .catch(() => {
        toast({ message: TOAST.COPY_AND_PASTE.fail, variant: 'error' });
      });
  };

  return (
    <footer className={style.footer}>
      <IconMultiLogo width={118} height={21} />

      <div className={style.info}>
        {FOOTER_CONTACT_ITEMS.map(({ type, label, value, accountHolder }) => (
          <p key={type}>
            <span className={style.bold}>{label}</span>{' '}
            <span
              onClick={() => handleCopy(value)}
              className={style.accountNumber}
            >
              {value}
            </span>{' '}
            {accountHolder}
          </p>
        ))}
      </div>

      <div className={style.menu}>
        {FOOTER_MENUS.map(({ title, to }) => (
          <Fragment key={title}>
            <Link to={to} target='_blank'>
              {title}
            </Link>
            <span className={style.separator}> | </span>
          </Fragment>
        ))}

        {FOOTER_SNS_LINKS.map(({ id, icon: IconComponent, to }) => (
          <Link key={id} to={to} target='_blank'>
            <IconComponent width={16.5} height={16.5} color='var(--grey-3-1)' />
          </Link>
        ))}
      </div>
    </footer>
  );
}
