import { useEffect, useState } from 'react';
import { FiCopy } from 'react-icons/fi';

import * as SnoroseIcons from '@snorose/icons';

import IconDocs from './IconDocs';
import styles from './IconGallery.stories.module.css';

const iconEntries = Object.entries(SnoroseIcons)
  .filter(([, Component]) => typeof Component === 'function')
  .sort(([firstName], [secondName]) => firstName.localeCompare(secondName));

const groups = [
  {
    id: 'basic',
    title: 'Basic icons',
    entries: iconEntries.filter(
      ([name]) => name.startsWith('Icon') && !name.startsWith('IconMulti')
    ),
  },
  {
    id: 'multi',
    title: 'Multi-color icons',
    entries: iconEntries.filter(([name]) => name.startsWith('IconMulti')),
  },
  {
    id: 'illustration',
    title: 'Illustrations',
    entries: iconEntries.filter(([name]) => name.startsWith('Illustration')),
  },
];

const getFilteredGroups = (query, category) => {
  const normalizedQuery = query.trim().toLowerCase();

  return groups
    .filter((group) => group.id === category)
    .map((group) => ({
      ...group,
      entries: group.entries.filter(([name]) =>
        name.toLowerCase().includes(normalizedQuery)
      ),
    }))
    .filter((group) => group.entries.length > 0);
};

const CopyButton = ({ children, className, label, text }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('복사됨');
    } catch {
      setStatus('복사 실패. 다시 시도해 주세요.');
    }
  };

  return (
    <button
      type='button'
      className={className}
      aria-label={label}
      title={label}
      onClick={copy}
    >
      {children}
      <span className={styles.copyStatus} role='status'>
        {status}
      </span>
    </button>
  );
};

const IconTile = ({ IconComponent, color, name, size }) => (
  <li className={styles.tile}>
    <CopyButton
      className={styles.copyTile}
      label={`${name} JSX 복사`}
      text={`<${name} width={${size}} height={${size}}${color ? ` color="${color}"` : ''} />`}
    >
      <div className={styles.preview} aria-hidden='true'>
        <IconComponent
          className={styles.icon}
          width={size}
          height={size}
          color={color}
        />
      </div>
      <span className={styles.name}>{name}</span>
    </CopyButton>
    <CopyButton
      className={styles.copyImport}
      label={`${name} import 복사`}
      text={`import { ${name} } from '@snorose/icons';`}
    >
      <FiCopy aria-hidden='true' />
      <span>import</span>
    </CopyButton>
  </li>
);

const Gallery = ({ category, color, query, size }) => {
  const filteredGroups = getFilteredGroups(query, category);
  const iconCount = filteredGroups.reduce(
    (total, group) => total + group.entries.length,
    0
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>@snorose/icons</h1>
          <p className={styles.description}>{iconCount} assets</p>
        </div>
      </header>

      {filteredGroups.length > 0 ? (
        <div className={styles.groups}>
          {filteredGroups.map((group) => (
            <section className={styles.group} key={group.id}>
              <div className={styles.groupHeader}>
                <h2 className={styles.groupTitle}>{group.title}</h2>
                <span className={styles.count}>{group.entries.length}</span>
              </div>
              <ul className={styles.grid}>
                {group.entries.map(([name, IconComponent]) => (
                  <IconTile
                    color={category === 'basic' ? color : undefined}
                    IconComponent={IconComponent}
                    key={name}
                    name={name}
                    size={size}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No icons found.</div>
      )}
    </main>
  );
};

const meta = {
  title: 'Foundations/Iconography',
  component: Gallery,
  parameters: {
    canvasWidth: 'min(1120px, calc(100vw - 48px))',
    docs: {
      page: IconDocs,
    },
  },
  argTypes: {
    category: {
      control: false,
      table: { disable: true },
    },
    color: {
      if: { arg: 'category', eq: 'basic' },
      control: 'select',
      options: [
        'var(--grey-4)',
        'var(--grey-3-1)',
        'var(--grey-3)',
        'var(--blue-4)',
        'var(--blue-3)',
        'var(--pink-3)',
        'var(--pink-2)',
        'var(--white)',
      ],
      description: 'currentColor 기반 아이콘에 적용할 색상',
    },
    query: {
      control: 'text',
      description: '컴포넌트 이름 검색어',
    },
    size: {
      control: { type: 'range', min: 16, max: 96, step: 4 },
      description: 'SVG width/height (px)',
    },
  },
  args: {
    color: 'var(--grey-4)',
    query: '',
    size: 32,
  },
};

export default meta;

export const Basic = {
  args: { category: 'basic' },
};

export const Multi = {
  args: { category: 'multi' },
};

export const Illustration = {
  args: { category: 'illustration', size: 96 },
};
