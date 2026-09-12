import { useEffect, useState } from 'react';

import {
  IconMultiBellPink,
  IconSearch,
  IllustrationBellEmpty,
} from '@snorose/icons';
import { Source } from '@storybook/blocks';

import styles from './IconGallery.stories.module.css';

const PackageVersion = () => {
  const [latestVersion, setLatestVersion] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch('https://registry.npmjs.org/@snorose%2ficons/latest', {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Package version unavailable');
        return response.json();
      })
      .then((data) => {
        if (typeof data.version !== 'string')
          throw new Error('Invalid package version');
        if (active) setLatestVersion(data.version);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => clearTimeout(timer));

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return (
    <p aria-live='polite'>
      프로젝트 사용 버전: v{process.env.STORYBOOK_ICONS_VERSION} · 최신 배포
      버전:{' '}
      <a
        href='https://www.npmjs.com/package/@snorose/icons'
        target='_blank'
        rel='noreferrer'
      >
        {latestVersion
          ? `v${latestVersion}`
          : failed
            ? 'npm에서 확인'
            : '확인 중…'}
      </a>
    </p>
  );
};

const IconDocs = () => (
  <article className={styles.docs}>
    <h1>Iconography</h1>
    <PackageVersion />
    <p>
      @snorose/icons의 React SVG 컴포넌트입니다. 전체 목록은 Basic, Multi,
      Illustration에서 확인할 수 있습니다.
    </p>
    <nav aria-label='아이콘 갤러리' className={styles.docsLinks}>
      <a href='./?path=/story/foundations-iconography--basic' target='_top'>
        Basic
      </a>
      <a href='./?path=/story/foundations-iconography--multi' target='_top'>
        Multi
      </a>
      <a
        href='./?path=/story/foundations-iconography--illustration'
        target='_top'
      >
        Illustration
      </a>
    </nav>
    <h2>기본 사용</h2>
    <IconSearch
      width={32}
      height={32}
      color='var(--grey-4)'
      aria-hidden='true'
    />
    <Source
      language='jsx'
      code={`import { IconSearch } from '@snorose/icons';

<IconSearch width={32} height={32} color='var(--grey-4)' />`}
    />
    <h2>Props</h2>
    <p>
      일반 SVG 속성을 SVG 요소에 전달합니다. size 전용 prop 대신 width와
      height에 px 기준 숫자를 전달하세요.
    </p>
    <div className={styles.tableScroll}>
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>값</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>width / height</td>
            <td>number 또는 string</td>
            <td>
              표시 크기. 기본값은 컴포넌트별로 다릅니다. IconSearch는 24 ×
              24입니다.
            </td>
          </tr>
          <tr>
            <td>color</td>
            <td>CSS 색상</td>
            <td>
              currentColor를 사용하는 부분에 적용됩니다. 프로젝트 색상은
              var(--grey-4) 같은 CSS 변수로 전달합니다.
            </td>
          </tr>
          <tr>
            <td>className</td>
            <td>string</td>
            <td>SVG에 CSS 클래스를 적용합니다.</td>
          </tr>
          <tr>
            <td>aria-hidden / aria-label / role</td>
            <td>ARIA 및 SVG 속성</td>
            <td>장식 여부와 접근 가능한 이름을 지정합니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Source
      language='jsx'
      code={`<IconSearch width={24} height={24} color='var(--grey-4)' className='search-icon' />`}
    />
    <h2>종류와 색상</h2>
    <div className={styles.examples}>
      <figure>
        <IconSearch
          width={32}
          height={32}
          color='var(--blue-4)'
          aria-hidden='true'
        />
        <figcaption>Basic</figcaption>
      </figure>
      <figure>
        <IconMultiBellPink width={32} height={32} aria-hidden='true' />
        <figcaption>Multi</figcaption>
      </figure>
      <figure>
        <IllustrationBellEmpty width={80} height={80} aria-hidden='true' />
        <figcaption>Illustration</figcaption>
      </figure>
    </div>
    <p>
      Basic은 color로 색상을 변경합니다. Multi와 Illustration은 고정 색상이나
      그라데이션을 포함하므로 color만으로 전체 색상이 바뀌지 않습니다.
      일러스트는 원본 viewBox 비율을 유지한 채 지정한 영역 안에 표시됩니다.
    </p>
    <Source
      language='jsx'
      code={`import { IconMultiBellPink, IllustrationBellEmpty } from '@snorose/icons';

<IconMultiBellPink width={24} height={24} />
<IllustrationBellEmpty width={109} height={106} />`}
    />
    <h2>접근성</h2>
    <p>
      텍스트를 보조하는 아이콘은 aria-hidden으로 숨깁니다. 아이콘만 있는
      버튼에는 버튼 자체에 이름을 지정하고, 독립적인 의미가 있는 아이콘에는
      role과 aria-label을 전달합니다.
    </p>
    <Source
      language='jsx'
      code={`<button type='button' aria-label='검색'>
  <IconSearch width={24} height={24} aria-hidden='true' />
</button>

<IconMultiBellPink role='img' aria-label='알림' width={24} height={24} />`}
    />
  </article>
);

export default IconDocs;
