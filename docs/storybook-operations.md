# Storybook 운영 가이드

이 문서는 Storybook의 배포 방식과 작성 규칙을 설명한다. Storybook에 표시되는 버전 정보는 `@snorose/icons`에만 해당한다.

## 🔗 Storybook 주소

- 개발: [storybook.dev.snorose.com](https://storybook.dev.snorose.com)
- 운영: [storybook.snorose.com](https://storybook.snorose.com)

## 🚀 배포 흐름

| 시점               | 확인 위치                                           | 설명                                                                                                                 |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| PR 브랜치에 push   | PR 전용 Preview                                     | 빌드 성공 시 생성되며, 배포마다 주소가 달라진다. PR의 `Cloudflare Pages: snorose-front-storybook` 체크에서 확인한다. |
| PR을 `dev`에 merge | [개발 Storybook](https://storybook.dev.snorose.com) | `dev` 기준 빌드 성공 시 자동 배포된다.                                                                               |
| `main`에 merge     | [운영 Storybook](https://storybook.snorose.com)     | `main` 기준 빌드 성공 시 자동 배포된다.                                                                              |

로컬에서 Storybook을 실행하려면 다음 명령어를 사용한다.

```bash
npm run storybook
```

배포용 Storybook이 정상적으로 만들어지는지 확인하려면 다음 명령어를 사용한다.

```bash
npm run build-storybook
```

## 📦 아이콘 패키지 업데이트

Storybook의 아이콘 문서는 `snorose-front`에 설치된 `@snorose/icons`를 기준으로 만들어진다.

Storybook에 표시되는 버전은 전체 Storybook이나 개별 컴포넌트의 버전이 아닌, 아이콘 패키지의 버전을 의미한다.

아이콘 패키지가 npm에 새로 배포되어도 Storybook이 바로 업데이트되지는 않는다. `@snorose/icons`를 새 버전으로 업데이트하여 `package.json`과 `package-lock.json`에 반영하고, 해당 변경을 브랜치에 포함해야 한다.

1. `snorose-front`에서 `@snorose/icons`를 새 버전으로 업데이트한다.
2. `package.json`과 `package-lock.json` 변경을 함께 PR에 포함한다.
3. PR Preview에서 아이콘 목록과 패키지 버전을 확인한다.
4. PR을 `dev`에 merge해 개발 Storybook에 반영한다.
5. 이후 `main`에 merge해 운영 Storybook에 반영한다.

## ✍️ Story 작성 규칙

### Story 분류

`title`은 Storybook 사이드바에 다음과 같은 계층으로 표시되도록 작성한다.

```text
Storybook
├── Foundations
│   ├── Colors
│   ├── Iconography
│   └── Typography
├── Component
│   ├── Button
│   │   ├── ActionButton
│   │   └── ResetButton
│   └── Input
│       ├── EmailInput
│       └── TextInput
└── Feature
    ├── Board
    │   ├── NoticeBar
    │   └── PostBar
    └── Attendance
        └── Calendar
```

- `Foundations`: 색상, 아이콘 등 디자인 기반 요소
- `Component`: 여러 화면에서 공통으로 사용하는 UI
- `Feature`: 특정 기능이나 도메인에 속하는 UI

### 파일 구조 및 네이밍 규칙

- 파일명은 `컴포넌트이름.stories.jsx` 형식으로 작성한다.
  - 올바른 예: `AppBar.stories.jsx`, `Button.stories.jsx`
  - 잘못된 예: `appBarStory.jsx`, `button_story.jsx`
- 컴포넌트, `Template`, export하는 Story 변수는 `PascalCase`로 작성한다.
- `meta`, `args`와 그 밖의 설정 객체는 `camelCase`로 작성한다.
- 컴포넌트 Story는 해당 컴포넌트와 같은 폴더에 위치시킨다.
- 색상, 아이콘 등 독립적인 디자인 기반 문서는 `src/stories/foundations`에 위치시킨다.
- Story를 일시적으로 Storybook에서 제외할 때는 파일명을 `컴포넌트이름.stories.disabled.jsx`로 변경한다.
  다시 활성화할 때는 파일명을 `컴포넌트이름.stories.jsx`로 되돌린다.

### 작성 방식

- `meta` 객체를 default export하고 컴포넌트 설명과 필요한 Controls를 정의한다.
- 기본 Story는 `Template`과 `args`로 작성한다.
- 배경이나 여백 등 별도 환경이 필요할 때만 decorator 또는 Wrapper를 사용한다.
- `title`은 컴포넌트 성격에 따라 `Component`, `Feature`, `Foundations`로 분류한다.

```jsx
import ComponentName from './ComponentName';

const meta = {
  title: 'Component/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: { component: '컴포넌트의 역할을 설명한다.' },
    },
  },
  argTypes: {
    title: { control: 'text', description: '표시할 제목' },
  },
};

export default meta;

const Template = (args) => <ComponentName {...args} />;

export const Default = Template.bind({});
Default.args = { title: '기본 제목' };
```
