import { useEffect, useMemo, useState } from 'react';

import styles from './Typography.stories.module.css';

const typographyGroups = [
  {
    name: 'Title',
    tokens: ['--text-title-1-bold', '--text-title-1-med', '--text-title-1-reg'],
  },
  {
    name: 'Heading',
    tokens: [
      '--text-heading-1-bold',
      '--text-heading-1-med',
      '--text-heading-1-reg',
    ],
  },
  {
    name: 'Headline',
    tokens: [
      '--text-headline-1-bold',
      '--text-headline-1-med',
      '--text-headline-1-reg',
      '--text-headline-2-bold',
      '--text-headline-2-med',
      '--text-headline-2-reg',
    ],
  },
  {
    name: 'Body',
    tokens: [
      '--text-body-1-bold',
      '--text-body-1-med',
      '--text-body-1-reg',
      '--text-body-2-bold',
      '--text-body-2-med',
      '--text-body-2-reg',
    ],
  },
  {
    name: 'Caption',
    tokens: [
      '--text-caption-1-bold',
      '--text-caption-1-med',
      '--text-caption-1-reg',
    ],
  },
];

const getTypographyTokens = () => {
  const rootStyles = getComputedStyle(document.documentElement);

  return typographyGroups.map((group) => ({
    ...group,
    tokens: group.tokens.map((name) => ({
      name,
      value: rootStyles.getPropertyValue(name).trim(),
    })),
  }));
};

const TypographyToken = ({ name, sample, value }) => {
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (!copyStatus) return undefined;

    const timer = setTimeout(() => setCopyStatus(''), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(`var(${name})`);
      setCopyStatus('복사됨');
    } catch {
      setCopyStatus('복사 실패');
    }
  };

  return (
    <li className={styles.token}>
      <p className={styles.preview} style={{ font: `var(${name})` }}>
        {sample}
      </p>
      <div className={styles.details}>
        <button
          type='button'
          className={styles.copyButton}
          onClick={copyToken}
          aria-label={`${name} 변수 복사`}
        >
          <code>{name}</code>
        </button>
        <code className={styles.value}>{value}</code>
        <span className={styles.copyStatus} role='status'>
          {copyStatus}
        </span>
      </div>
    </li>
  );
};

const Typography = ({ query, sample }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setGroups(getTypographyTokens());
  }, []);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return groups
      .map((group) => ({
        ...group,
        tokens: group.tokens.filter(({ name, value }) =>
          `${name} ${value}`.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((group) => group.tokens.length > 0);
  }, [groups, query]);

  const tokenCount = filteredGroups.reduce(
    (total, group) => total + group.tokens.length,
    0
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Typography</h1>
          <p className={styles.description}>
            Spoqa Han Sans Neo · {tokenCount} tokens
          </p>
        </div>
      </header>

      {filteredGroups.length > 0 ? (
        <div className={styles.groups}>
          {filteredGroups.map((group) => (
            <section className={styles.group} key={group.name}>
              <div className={styles.groupHeader}>
                <h2 className={styles.groupTitle}>{group.name}</h2>
                <span className={styles.count}>{group.tokens.length}</span>
              </div>
              <ul className={styles.tokenList}>
                {group.tokens.map((token) => (
                  <TypographyToken
                    key={token.name}
                    {...token}
                    sample={sample}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>일치하는 타이포그래피 변수가 없습니다.</p>
      )}
    </main>
  );
};

const meta = {
  title: 'Foundations/Typography',
  component: Typography,
  tags: ['!autodocs'],
  parameters: { canvasWidth: 'min(1120px, calc(100vw - 48px))' },
  argTypes: {
    query: {
      control: 'text',
      description: '타이포그래피 변수명 또는 값 검색',
    },
    sample: {
      control: 'text',
      description: '타이포그래피 미리보기 문구',
    },
  },
  args: {
    query: '',
    sample: '숙명인을 위한 커뮤니티, 스노로즈',
  },
};

export default meta;

export const All = {};
