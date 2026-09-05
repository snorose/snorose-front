# snorose-icon 일러스트 교체 내역

조사 기준일: 2026-09-05

기준 패키지: 현재 `snorose-front`에 설치된 `@snorose/icons@0.0.0` 최신 설치본

## 기준

- `@snorose/icons` 설치본에서 실제 export되는 컴포넌트만 사용했다.
- 최신 설치본에서 추가 export가 확인된 일러스트까지 패키지 컴포넌트로 교체했다.
- 패키지 컴포넌트로 완전히 대체되어 더 이상 참조하지 않는 local SVG는 삭제했다.
- `src/assets/illustrations`는 더 이상 직접 참조되는 파일이 없어 barrel file까지 삭제했다.
- 패키지에 아직 없거나 패키지 편입 대상이 아닌 화면 이미지는 local asset으로 유지했다.
- 로고, 배지, 소형 UI 아이콘은 이번 일러스트 패키지 교체 범위에서 제외했다.

## 교체한 일러스트

| 패키지 컴포넌트 | 변경 화면/파일 | 삭제한 파일 |
| --- | --- | --- |
| `IllustrationEmailCheck` | `src/page/account/FoundIdPage/FoundIdPage.jsx`, `src/page/account/FoundPwPage/FoundPwPage.jsx` | `src/assets/illustrations/emailSendIllustration.svg` |
| `IllustrationClipboardSearch` | `src/page/maintenance/MaintenancePage/MaintenancePage.jsx` | `src/assets/illustrations/maintenanceConfig.svg` |
| `IllustrationBellEmpty` | `src/page/alert/AlertPage/AlertPage.jsx` | `src/assets/illustrations/noAlertIllustration.svg` |
| `IllustrationPostEmpty` | `src/feature/my/component/MyPostList/MyPostList.jsx`, `src/page/commerce/OrderListPage.tsx` | `src/assets/illustrations/noPostsIllustration.svg` |
| `IllustrationScrapPostEmpty` | `src/feature/my/component/MyPostList/MyPostList.jsx` | `src/assets/illustrations/noScrapedPostsIllustration.svg` |
| `IllustrationCommentEmpty` | `src/feature/my/component/MyPostList/MyPostList.jsx` | `src/assets/illustrations/noCommentedPostsIllustration.svg` |
| `IllustrationCalendarEmpty` | `src/feature/event/constant/guideModalOption.js`, `src/feature/event/component/GuideModal/GuideModal.jsx` | `src/assets/illustrations/noParticipationIllustration.svg` |
| `IllustrationTaskComplete` | `src/page/account/SignUpSuccessPage/SignUpSuccessPage.jsx`, `src/feature/account/component/snoroseVerifyStep/CompleteStep/CompleteStep.jsx`, `src/feature/commerce/components/SaleClosedSection.tsx` | `src/assets/illustrations/taskCompleteIllustration.svg` |
| `IllustrationTaskFailed` | `src/page/account/SignUpFailure/SignUpFailurePage.jsx`, `src/page/account/NotFoundIdPage/NotFoundIdPage.jsx`, `src/page/account/NotFoundPwPage/NotFoundPwPage.jsx` | `src/assets/illustrations/taskFailedIllustration.svg` |
| `IllustrationNotFound` | `src/page/etc/NotFoundPage/NotFoundPage.jsx` | `src/assets/illustrations/notFoundIllustration.svg` |
| `IllustrationNoTicketTransfer` | `src/feature/event/constant/guideModalOption.js`, `src/feature/event/component/GuideModal/GuideModal.jsx` | `src/assets/illustrations/noTransferIllustration.svg` |
| `IllustrationNoSales` | `src/feature/event/constant/guideModalOption.js`, `src/feature/event/component/GuideModal/GuideModal.jsx` | `src/assets/illustrations/noSellIllustration.svg` |
| `IllustrationBoxStarsOpen` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/event-board-page.svg` |
| `IllustrationBoxStarsCircle` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/home/component/HomeBoardCard/HomeBoardCard.jsx` | `src/assets/images/event-main.svg` |
| `IllustrationSnowfall` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/firstSnow-board-page.svg` |
| `IllustrationSnowfallCircle` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/home/component/HomeBoardCard/HomeBoardCard.jsx` | `src/assets/images/firstSnow-main.svg` |
| `IllustrationSnowGround` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/largeSnow-board-page.svg` |
| `IllustrationSnowGroundCircle` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/home/component/HomeBoardCard/HomeBoardCard.jsx` | `src/assets/images/largeSnow-main.svg` |
| `IllustrationSnowMountain` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/permanentSnow-board-page.svg` |
| `IllustrationSnowMountainCircle` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/home/component/HomeBoardCard/HomeBoardCard.jsx` | `src/assets/images/permanentSnow-main.svg` |
| `IllustrationStarHonorBoard` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/besookt-board-page.svg` |
| `IllustrationMicrophone` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/studentCouncil-board-page.svg` |
| `IllustrationBooksCap` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/graduationPreparation-board-page.svg` |
| `IllustrationFolderSearch` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts`, `src/feature/board/component/BoardBar/BoardBar.jsx` | `src/assets/images/financeAudit-board-page.svg` |
| `IllustrationFlag` | `src/feature/home/component/HomeCard/HomeCard.jsx` | `src/assets/images/flag.svg` |
| `IllustrationPadlock` | `src/feature/home/component/HomeBoardCard/HomeBoardCard.jsx` | `src/assets/images/lock.svg` |

## 미사용으로 삭제한 asset

| 삭제한 파일 | 비고 |
| --- | --- |
| `src/assets/illustrations/index.js` | 패키지 교체 후 re-export할 local illustration asset이 없어 삭제 |
| `src/assets/images/sponsor.svg` | 코드에서 참조하지 않고, 패키지 포함 예정이 없어 삭제 |

## 렌더링 변경

| 파일 | 변경 내용 |
| --- | --- |
| `src/feature/event/component/GuideModal/GuideModal.jsx` | 이벤트 가이드 이미지를 모두 패키지 컴포넌트로 렌더링하도록 정리 |
| `src/feature/board/component/BoardBar/BoardBar.jsx` | 게시판 이미지가 패키지 컴포넌트와 남아 있는 local 이미지 URL을 모두 받을 수 있도록 `BoardImage` 추가 |
| `src/feature/home/component/HomeBoardCard/HomeBoardCard.jsx` | 홈 게시판 원형 이미지와 잠금 이미지를 패키지 컴포넌트로 교체 |
| `src/feature/home/component/HomeBoardCard/HomeBoardCard.module.css` | 홈 게시판 원형 이미지가 모바일/PC에서 같은 비율로 채워지도록 SVG 크기를 카드 내부 기준으로 정리 |
| `src/feature/my/component/MyPostList/MyPostList.jsx` | activity key별 빈 상태 이미지를 패키지 컴포넌트 map으로 변경 |

## TODO

- `src/feature/board/component/BoardBar/BoardBar.jsx`: `sookPlace.svg`, `residence.svg`까지 패키지에 추가되면 문자열 이미지 분기와 `<img>` 렌더링을 제거한다.
- `src/feature/my/component/MyPostList/MyPostList.jsx`: 호출부에서 빈 상태 일러스트 컴포넌트를 직접 넘기도록 리팩토링하면 임시 map을 제거한다.

## 패키지에 없어 화면에 남긴 이미지

| local asset | 사용 화면/파일 | 비고 |
| --- | --- | --- |
| `src/assets/images/sookPlace.svg` | `src/shared/constant/board.js`, `src/assets/map/board-assets.ts` | 게시판 이미지, 현재 패키지에 대응 컴포넌트 없음 |
| `src/assets/images/residence.svg` | `src/shared/constant/board.js` | 게시판 이미지, 현재 패키지에 대응 컴포넌트 없음 |
| `src/assets/images/hallOfFame.svg` | `src/page/snorose/AboutPage/AboutPage.jsx` | 명예의 전당 전용 대형 일러스트 |
| `src/assets/images/bannerError.svg` | `src/feature/home/component/Slide/Slide.jsx` | 배너 로딩 실패 fallback 이미지 |
| `src/assets/images/defaultProfile.svg` | `src/feature/my/component/CircleProfile/CircleProfile.jsx`, `src/page/user/EditProfilePage/EditProfilePage.jsx` | 프로필 placeholder |
| `src/assets/images/altImage.png` | `src/apis/post.js`, `src/feature/board/component/PostBar/PostBar.jsx`, `src/feature/board/component/FullScreenAttachment/FullScreenAttachment.jsx`, `src/shared/component/AttachmentList/AttachmentList.jsx`, `src/shared/component/AttachmentSwiper/AttachmentSwiper.jsx`, `src/feature/commerce/components/ProductCard.tsx`, `src/feature/commerce/components/OrderItem.tsx` | 첨부/상품/썸네일 fallback raster 이미지 |
| `src/assets/backgrounds/snowyBackground.png` | `src/feature/my/component/TopOverlay/TopOverlay.module.css` | 마이페이지 상단 배경 이미지 |
| `src/feature/home/component/PopUp/event.png` | `src/feature/home/component/PopUp/PopUpContents.jsx` | 홈 팝업 안내 이미지 |
| `src/feature/home/component/PopUp/newBoard.png` | `src/feature/home/component/PopUp/PopUpContents.jsx` | 홈 팝업 안내 이미지 |
| `src/feature/home/component/PopUp/calendar.png` | `src/feature/home/component/PopUp/PopUpContents.jsx` | 홈 팝업 안내 이미지 |
| `src/assets/images/attachmentGuide1.png` | `src/page/board/WritePostPage/WritePostPage.jsx` | 게시글 작성 첨부 가이드 이미지 |
| `src/assets/images/attachmentGuide2.png` | `src/page/board/WritePostPage/WritePostPage.jsx` | 게시글 작성 첨부 가이드 이미지 |
| `src/assets/banners/sponsorBanner.png` | `src/feature/board/ui/PostDetailView.jsx` | 후원 배너 이미지 |
