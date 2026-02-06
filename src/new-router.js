import { attendanceLoader } from '@/shared/loader';
import {
  NavbarLayout,
  PostListPageSelector,
  PostPageSelector,
  WritePageSelector,
  EditPageSelector,
} from '@/shared/ui';
import { BOARD_SECTION } from '@/shared/constant';

import App from '@/App';
import {
  LoginPage,
  FindIdPage,
  FindPwPage,
  FoundIdPage,
  FoundPwPage,
  NotFoundIdPage,
  NotFoundPwPage,
  SignUpPage,
  SignUpSuccessPage,
  SignUpFailurePage,
  SnoroseVerifyPage,
} from '@/page/account';
import { AlertPage, AlertSettingPage, MarketingTermsPage } from '@/page/alert';
import {
  BoardCategoryPage,
  EditPostPage,
  NoticeListPage,
  PostPage,
  WritePostPage,
} from '@/page/board';
import { NotFoundPage } from '@/page/etc';

import { AttendancePage, MainPage } from '@/page/home';
import { SearchPage } from '@/page/search';
import {
  AboutPage,
  PrivacyPolicyPage,
  ServicePolicyPage,
} from '@/page/snorose';
// import {
//   WriteInquiryPage,
//   EditInquiryPage,
//   WriteReportPage,
//   EditReportPage,
//   FAQPage,
// } from '@/page/support';
import {
  ActivityPage,
  ChangePwPage,
  DeleteAccountPage,
  EditProfilePage,
  MyPage,
  PointLogListPage,
} from '@/page/user';

import { MaintenancePage } from '@/page/maintenance';

import BoardValidator from '@/BoardValidator';
import RequireAuth from '@/RequireAuth';
import BoardGuard from '@/BoardGuard';
import UnverifiedOnly from '@/UnverifiedOnly';

export const routeList = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <NavbarLayout>
            <MainPage />
          </NavbarLayout>
        ),
      },
      {
        path: '/home',
        element: (
          <NavbarLayout>
            <MainPage />
          </NavbarLayout>
        ),
      },

      /* 공지사항 */
      {
        path: '/notice',
        children: [
          { index: true, element: <NoticeListPage /> },
          { path: ':postId', element: <PostPage /> },
          {
            element: <BoardGuard isAdminOnly />,
            children: [
              { path: 'write', element: <WritePostPage isNotice /> },
              { path: ':postId/edit', element: <EditPostPage isNotice /> },
            ],
          },
        ],
      },

      {
        path: '/board',
        element: (
          <NavbarLayout>
            <BoardCategoryPage />
          </NavbarLayout>
        ),
      },
      {
        path: '/search',
        element: <SearchPage />,
      },

      /* 게시판 */
      {
        path: '/board/:boardName',
        element: (
          <BoardValidator>
            <RequireAuth>
              <BoardGuard action={'read'} />
            </RequireAuth>
          </BoardValidator>
        ),
        children: [
          { index: true, element: <PostListPageSelector /> },
          {
            path: `search`,
            element: <SearchPage />,
            handle: { feature: BOARD_SECTION.SEARCH },
          },
          {
            path: `notice`,
            children: [
              { index: true, element: <NoticeListPage /> },
              { path: `:postId`, element: <PostPage /> },
              {
                element: <BoardGuard isAdminOnly />,
                children: [
                  { path: `write`, element: <WritePostPage isNotice /> },
                  { path: `:postId/edit`, element: <EditPostPage isNotice /> },
                ],
              },
            ],
            handle: { feature: BOARD_SECTION.NOTICE },
          },
          {
            path: `post/:postId`,
            element: <PostPageSelector />,
            handle: { feature: BOARD_SECTION.DETAIL },
          },
          {
            element: <BoardGuard action={'write'} />,
            children: [
              { path: `write`, element: <WritePageSelector /> },
              { path: `post/:postId/edit`, element: <EditPageSelector /> },
            ],
            handle: { feature: BOARD_SECTION.EDITOR },
          },
        ],
      },

      /* 알림 */
      {
        path: '/alert',
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: (
              <NavbarLayout>
                <AlertPage />
              </NavbarLayout>
            ),
          },
          { path: 'setting', element: <AlertSettingPage /> },
        ],
      },

      {
        path: '/terms/marketing',
        element: <MarketingTermsPage />,
      },

      {
        path: '/attendance',
        element: (
          <RequireAuth>
            <AttendancePage />
          </RequireAuth>
        ),
        loader: attendanceLoader,
      },

      /* 문의 및 신고 */
      // {
      //   path: 'support',
      //   element: <RequireAuth />,
      //   children: [
      //     {
      //       path: 'faq',
      //       element: (
      //         <ProtectedRoute>
      //           <FAQPage />
      //         </ProtectedRoute>
      //       ),
      //     },
      //   ],
      // },
      // {
      //   path: 'inquiry',
      //   children: [
      //     {
      //       path: 'write',
      //       element: (
      //         <ProtectedRoute>
      //           <WriteInquiryPage />
      //         </ProtectedRoute>
      //       ),
      //     },
      //     {
      //       path: ':inquiryId',
      //       element: (
      //         <ProtectedRoute>
      //           <PostPage />
      //         </ProtectedRoute>
      //       ),
      //     },
      //     {
      //       path: ':inquiryId/edit',
      //       element: (
      //         <ProtectedRoute>
      //           <EditInquiryPage />
      //         </ProtectedRoute>
      //       ),
      //     },
      //   ],
      // },
      // {
      //   path: 'report',
      //   children: [
      //     {
      //       path: 'write',
      //       children: [
      //         { index: true, element: <NotFoundPage /> },
      //         {
      //           path: ':reportType',
      //           element: (
      //             <ProtectedRoute>
      //               <WriteReportPage />
      //             </ProtectedRoute>
      //           ),
      //         },
      //       ],
      //     },
      //     {
      //       path: ':reportId',
      //       element: (
      //         <ProtectedRoute>
      //           <PostPage />
      //         </ProtectedRoute>
      //       ),
      //     },
      //     {
      //       path: ':reportId/edit',
      //       element: (
      //         <ProtectedRoute>
      //           <EditReportPage />
      //         </ProtectedRoute>
      //       ),
      //     },
      //   ],
      // },

      /* 마이페이지 */
      {
        path: '/my-page',
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: (
              <NavbarLayout>
                <MyPage />
              </NavbarLayout>
            ),
          },
          { path: 'password', element: <ChangePwPage /> },
          { path: 'edit-info', element: <EditProfilePage /> },
          { path: 'view-point-list', element: <PointLogListPage /> },
          { path: 'delete-account', element: <DeleteAccountPage /> },
          { path: 'my-post', element: <ActivityPage /> },
          { path: 'comment', element: <ActivityPage /> },
          { path: 'download-exam-review', element: <ActivityPage /> },
          { path: 'scrap', element: <ActivityPage /> },
          { path: 'scrap-exam-review', element: <ActivityPage /> },
          // { path: '/my-page/inquiry-report', element: <FAQPage /> },
        ],
      },

      { path: '/my-page/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/my-page/service-policy', element: <ServicePolicyPage /> },

      { path: '/about', element: <AboutPage /> },
      {
        path: '/verify',
        element: (
          <RequireAuth>
            <UnverifiedOnly>
              <SnoroseVerifyPage />
            </UnverifiedOnly>
          </RequireAuth>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/find-id', element: <FindIdPage /> },
      { path: '/find-pw', element: <FindPwPage /> },
      { path: '/found-id', element: <FoundIdPage /> },
      { path: '/found-pw', element: <FoundPwPage /> },
      { path: '/not-found-id', element: <NotFoundIdPage /> },
      { path: '/not-found-pw', element: <NotFoundPwPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/signup/success', element: <SignUpSuccessPage /> },
      { path: '/signup/failure', element: <SignUpFailurePage /> },
      { path: '/maintenance', element: <MaintenancePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
