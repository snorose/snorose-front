# <img src="https://github.com/user-attachments/assets/546a4306-4c36-4717-94e5-1b7d360ffe36" width="40" height="auto"/> SNOROSE | 스노로즈

스노로즈는 숙명인이 직접 운영하는 숙명인만을 위한 커뮤니티입니다.

<img src="https://github.com/user-attachments/assets/6a5bc684-d05a-488a-ac54-9a656f01fae1" width="200" height="auto"/>

<br/>
<br/>

## 🚀 프로젝트 배경

기존 스노로즈는 **WordPress**와 **php** 로 개발되었으나, 다음과 같은 문제들이 발생했습니다:

- **업데이트 문제**: 플랫폼이 자주 업데이트되지 않아 기능 확장과 유지보수가 어려웠습니다.
- **오류 빈번**: 다양한 오류가 발생해 사용자 경험이 떨어지고, 문제 해결에 많은 시간이 소요되었습니다.
- **기술적 한계**: WordPress의 기본 구조와 플러그인 의존성으로 인해 필요한 기능을 자유롭게 구현하는 데 한계가 있었습니다.

이러한 이유로, 새로운 기술 스택을 도입하여 더 안정적이고 확장 가능한 커뮤니티 플랫폼을 개발하기로 결정하였습니다.

<br />

## 🔧 기술 스택

- **Front-end**
  - **React**: 인터랙티브하고 효율적인 웹 애플리케이션을 만드는 데 최적화된 라이브러리.
  - **TanStack Query**: 서버 상태 관리를 쉽게 도와주는 라이브러리.
  - **React Router**: 페이지 간 네비게이션을 관리하는 라이브러리.
- **Language**
  - **JavaScript**: 프론트엔드 애플리케이션의 주 언어.
- **Deployment**

  - **Cloudflare Pages**: 웹사이트 호스팅 서비스.

- **Infrastructure**: Cloudflare (DNS)

- **Version Control**: Git, GitHub

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![ReactQuery](https://img.shields.io/badge/ReactQuery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![ReactRouter](https://img.shields.io/badge/ReactRouter-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CloudflarePages](https://img.shields.io/badge/CloudflarePages-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

<br />

## 📂 주요 기능

- **회원가입 및 로그인**

  - 사용자는 이메일과 비밀번호로 회원가입 및 로그인

- **숙명인 인증**

  - 포털과 학교 이메일을 통해 숙명여대 학생 인증

- **게시글 및 댓글 작성**

  - 게시글과 댓글을 익명 또는 닉네임으로 작성

- **검색 기능**

  - 게시글 및 커뮤니티 내 정보들을 검색

- **좋아요 및 스크랩**

  - 마음에 드는 게시글에 좋아요를 누르고, 스크랩하여 보관

- **시험후기 및 강의후기 작성**

  - **시험 후기**: 시험에 대한 후기 및 정보를 나눌 수 있는 게시판
  - **강의 후기**: 강의에 대한 후기를 작성 및 공유

- **공지**

  - 주요 소식을 공지하는 공지사항 기능

- **이벤트**

  - 스노로즈 내에서 진행되는 다양한 이벤트를 참여

- **마이페이지**

  - 자신의 정보를 관리할 수 있는 개인 페이지

- **포인트 시스템**
  - 커뮤니티 활동에 따른 포인트를 적립하고 사용

<br />

## Commit 컨벤션

**Commit 태그 종류**

```
[DOCS] : README나 WIKI 등의 문서 수정
[FEAT] : 새로운 기능 추가
[FIX] : 버그, 오류 수정
[MODIFY] : 기능 변경, 오타 등으로 인한 코드 수정
[REFACTOR] : 기능 변경이 일어나지 않는 유지보수 작업 (코드 구조 변경, 불필요한 리소스 삭제, 이름 변경 등)
[STYLE] : UI/UX, 스타일링 등 디자인 관련 작업
[TEST] : 테스트 추가 또는 이전 테스트 수정
[CHORE] : 빌드, 패키지 관리, 주석 추가 및 수정 등 기타 작업
```

<br />

**Commit 메시지 형식**

```js
[커밋 태그] #이슈 번호 커밋 내용

// 예시
[FEAT] #1 회원가입 기능 완료
```

<br />

## Issue 컨벤션

**Issue 태그 종류**

```
[FEAT] : 기능 추가
[FIX] : 에러 수정, 버그 수정
[DOCS] : README, 문서
[REFACTOR] : 코드 리펙토링 (기능 변경 없이 코드만 수정할 때)
[MODIFY] : 코드 수정 (기능의 변화가 있을 때)
[PERF] : 성능 개선 ( API 호출 횟수, 페이지 로드 시간 등 )
[CHORE] : 그 외 작업 내용
```

<br />

**Issue 제목**

```js
[커밋 태그] 커밋 내용

// 예시
[FEAT] 회원가입 구현
```

<br />

**브랜치 이름**

```
feat/#이슈 번호-기능 이름

// 예시
feat/#1-login
```
