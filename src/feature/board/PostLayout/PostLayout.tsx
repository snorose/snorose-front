import { Link } from 'react-router-dom';

import { IconMultiCloudLogo } from '@snorose/icons';

import { Badge } from '@/shared/component/Badge';
import { ROLE } from '@/shared/constant';
import { DateTime } from '@/shared/lib';

import geminiBanner from '@/assets/banners/gemini-banner.png';
import sponsorBanner from '@/assets/banners/sponsorBanner.png';

import styles from './PostLayout.module.css';

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}

function Header({ children }: { children: React.ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

function Meta({
  userDisplay,
  userRoleId,
  authorBadgeRoleId,
  createdAt,
  isEdited,
  children,
}: {
  userDisplay: string;
  userRoleId: number;
  authorBadgeRoleId?: number;
  createdAt: string;
  isEdited: boolean;
  children: React.ReactNode;
}) {
  const badgeRoleId = authorBadgeRoleId ?? userRoleId;
  const showBadge =
    badgeRoleId === ROLE.official ||
    (badgeRoleId === ROLE.admin && userDisplay !== '익명송이');

  return (
    <div className={styles.meta}>
      <div className={styles.info}>
        <IconMultiCloudLogo
          width={25}
          height={16}
          role='img'
          aria-label='로고'
        />

        <p className={styles.userDisplay}>{userDisplay || 'Unknown'}</p>

        {showBadge && (
          <Badge
            userRoleId={badgeRoleId}
            className={styles.badge}
            width={18}
            height={18}
          />
        )}

        <p className={styles.dot}>·</p>

        <p>
          {DateTime.format(createdAt, 'YMD_HM')}
          {isEdited && ' (수정됨)'}
        </p>
      </div>

      <div className={styles.chips}>{children}</div>
    </div>
  );
}

function ActionGroup({ children }: { children: React.ReactNode }) {
  return <div className={styles.actionGroup}>{children}</div>;
}

function Body({ children }: { children: React.ReactNode }) {
  const GEMINI_BANNER_END_AT = new Date('2026-11-28T00:00:00+09:00').getTime();
  const isGeminiBannerActive = Date.now() < GEMINI_BANNER_END_AT;

  return (
    <div className={styles.body}>
      {children}

      <div
        className={[
          styles.sponsorBanner,
          !isGeminiBannerActive && styles.croppedBanner,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isGeminiBannerActive ? (
          <Link to='/board/event/post/1931493'>
            <img
              src={geminiBanner}
              alt='Gemini 프로모션 이벤트 게시글 보기'
              className={styles.sponsorBanner}
            />
          </Link>
        ) : (
          <img
            src={sponsorBanner}
            alt='스노로즈 후원하기'
            className={styles.sponsorBanner}
          />
        )}
      </div>
    </div>
  );
}

function Title({
  title,
  viewCount = null,
}: {
  title: string;
  viewCount?: number | null;
}) {
  return (
    <div className={styles.title}>
      <h1>{title}</h1>

      {viewCount !== null && (
        <span className={styles.views}>{viewCount.toLocaleString()} views</span>
      )}
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}

PostLayout.Header = Header;
PostLayout.Meta = Meta;
PostLayout.ActionGroup = ActionGroup;

PostLayout.Body = Body;
PostLayout.Title = Title;

PostLayout.Footer = Footer;
