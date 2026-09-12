import { useEffect, useState } from 'react';

import styles from './ColorGallery.stories.module.css';

const groups = [
  { title: 'Blue', match: /^--blue-/ },
  { title: 'Pink', match: /^--pink-/ },
  { title: 'Green', match: /^--green-/ },
  { title: 'Neutral', match: /^--(?:grey|white|black)/ },
  { title: 'Gradients', match: /^--gradient-/ },
  {
    title: 'Board Backgrounds',
    match: /^--(?:firstSnow|largeSnow|permanentSnow|event)-bg$/,
  },
];

const readColors = () => {
  const names = new Set();
  const collect = (rules) => {
    for (const rule of rules) {
      if (rule.selectorText === ':root') {
        for (const name of rule.style) {
          if (groups.some((group) => group.match.test(name))) names.add(name);
        }
      }
      if (rule.cssRules) collect(rule.cssRules);
    }
  };

  for (const sheet of document.styleSheets) {
    try {
      collect(sheet.cssRules);
    } catch {
      // Cross-origin stylesheets cannot be inspected through CSSOM.
    }
  }

  const root = getComputedStyle(document.documentElement);
  return Array.from(names, (name) => ({
    name,
    value: root.getPropertyValue(name).trim(),
    usage: name.endsWith('-rgb') ? `rgb(var(${name}))` : `var(${name})`,
  }));
};

const ColorTile = ({ name, value, usage }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(usage);
      setStatus('복사됨');
    } catch {
      setStatus('복사 실패. 다시 시도해 주세요.');
    }
  };

  return (
    <li className={styles.tile}>
      <span
        className={styles.swatch}
        style={{ background: usage }}
        aria-hidden='true'
      />
      <button
        type='button'
        className={styles.copy}
        aria-label={`${usage} 복사`}
        title={`${usage} 복사`}
        onClick={copy}
      >
        <span
          className={styles.name}
          style={{ visibility: status ? 'hidden' : undefined }}
        >
          {name}
        </span>
        <span className={styles.copyStatus} role='status'>
          {status}
        </span>
      </button>
      <span className={styles.value}>{value}</span>
    </li>
  );
};

const ColorGallery = ({ query }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    setColors(readColors());
  }, []);

  const filtered = colors.filter(({ name, value }) =>
    `${name} ${value}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Colors</h1>
        <span>{filtered.length} tokens</span>
      </header>
      {groups.map(({ title, match }) => {
        const entries = filtered.filter(({ name }) => match.test(name));
        if (!entries.length) return null;
        return (
          <section className={styles.group} key={title}>
            <h2>{title}</h2>
            <ul className={styles.grid}>
              {entries.map((entry) => (
                <ColorTile key={entry.name} {...entry} />
              ))}
            </ul>
          </section>
        );
      })}
      {!filtered.length && (
        <p className={styles.empty}>표시할 색상이 없습니다.</p>
      )}
    </main>
  );
};

const meta = {
  title: 'Foundations/Colors',
  component: ColorGallery,
  tags: ['!autodocs'],
  parameters: { canvasWidth: 'min(1120px, calc(100vw - 48px))' },
  argTypes: {
    query: { control: 'text', description: '색상 변수명 또는 값 검색' },
  },
  args: { query: '' },
};

export default meta;

export const All = {};
