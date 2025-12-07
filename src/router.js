import { attendanceLoader } from '@/shared/loader';
import { NavbarLayout } from '@/shared/ui';
import { ROLE } from '@/shared/constant';

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
  PostListPage,
  PostPage,
  WritePostPage,
} from '@/page/board';
import { NotFoundPage } from '@/page/etc';
import {
  WriteEventPage,
  EditEventPage,
  EventListPage,
  EventPage,
} from '@/page/event';
import {
  EditExamReviewPage,
  ExamReviewListPage,
  ExamReviewPage,
  WriteExamReviewPage,
} from '@/page/exam';
import { AttendancePage, MainPage } from '@/page/home';
import { SearchPage } from '@/page/search';
import {
  AboutPage,
  PrivacyPolicyPage,
  ServicePolicyPage,
} from '@/page/snorose';
import {
  WriteInquiryPage,
  EditInquiryPage,
  WriteReportPage,
  EditReportPage,
  FAQPage,
} from '@/page/support';
import {
  ActivityPage,
  ChangePwPage,
  DeleteAccountPage,
  EditProfilePage,
  MyPage,
  PointLogListPage,
} from '@/page/user';

import ProtectedRoute from '@/ProtectedRoute';
import { MaintenancePage } from '@/page/maintenance';

import { CheckExamPeriodRoute } from '@/feature/exam/lib';

const getRolesForReadBoard = (boardPath) => {
  switch (boardPath) {
    case 'first-snow':
      return [ROLE.preUser, ROLE.user, ROLE.admin, ROLE.official];
    case 'large-snow':
      return [ROLE.user, ROLE.admin, ROLE.official];
    case 'permanent-snow':
      return [ROLE.user, ROLE.admin, ROLE.official];
    case 'besookt':
      return [ROLE.user, ROLE.admin, ROLE.official];
    case 'all':
      return [ROLE.preUser, ROLE.user, ROLE.admin, ROLE.official];
    case 'notice':
      return [
        ROLE.preUser,
        ROLE.user,
        ROLE.admin,
        ROLE.official,
        ROLE.blacklist,
      ];
    case 'student-council':
      return [ROLE.user, ROLE.admin, ROLE.official];
    case 'graduation-preparation':
      return [ROLE.user, ROLE.admin, ROLE.official];
    case 'finance-audit':
      return [ROLE.user, ROLE.admin, ROLE.official];
    default:
      return [];
  }
};

const getRolesForWriteBoard = (boardPath) => {
  switch (boardPath) {
    case 'first-snow':
      return [ROLE.preUser, ROLE.user, ROLE.admin, ROLE.official];
    case 'large-snow':
      return [ROLE.user, ROLE.admin];
    case 'permanent-snow':
      return [ROLE.user, ROLE.admin];
    case 'notice':
    case 'student-council':
    case 'finance-audit':
    case 'graduation-preparation':
      return [ROLE.admin, ROLE.official];
    default:
      return [];
  }
};

const boardPaths = [
  'first-snow',
  'large-snow',
  'permanent-snow',
  'besookt',
  'all',
  'notice',
  'student-council',
  'graduation-preparation',
  'finance-audit',
];

const boardRoutes = boardPaths.flatMap((boardPath) => [
  {
    path: `/board/${boardPath}`,
    element: (
      <ProtectedRoute
        roles={getRolesForReadBoard(boardPath)}
        message={'게시판 접근 권한이 없어요'}
      >
        {boardPath === 'notice' ? <NoticeListPage /> : <PostListPage />}
      </ProtectedRoute>
    ),
  },
  {
    path: `/board/${boardPath}/notice`,
    element: (
      <ProtectedRoute
        roles={getRolesForReadBoard(boardPath)}
        message={'게시판 접근 권한이 없어요'}
      >
        <NoticeListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: `/board/${boardPath}/post/:postId`,
    element: (
      <ProtectedRoute
        roles={getRolesForReadBoard(boardPath)}
        message={'게시글 접근 권한이 없어요'}
      >
        <PostPage />
      </ProtectedRoute>
    ),
  },
  {
    path: `/board/${boardPath}/post-write`,
    element: (
      <ProtectedRoute
        roles={getRolesForWriteBoard(boardPath)}
        message={'게시글 작성 권한이 없어요'}
      >
        <WritePostPage />
      </ProtectedRoute>
    ),
  },
  {
    path: `/board/${boardPath}/post/:postId/edit`,
    element: (
      <ProtectedRoute
        roles={getRolesForWriteBoard(boardPath)}
        message={'게시글 편집 권한이 없어요'}
      >
        <EditPostPage />
      </ProtectedRoute>
    ),
  },
  {
    path: `/board/${boardPath}/search`,
    element: (
      <ProtectedRoute
        roles={getRolesForReadBoard(boardPath)}
        message={'게시판 접근 권한이 없어요'}
      >
        <SearchPage />
      </ProtectedRoute>
    ),
  },
]);

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
      {
        path: '/board',
        element: (
          <NavbarLayout>
            <BoardCategoryPage />
          </NavbarLayout>
        ),
      },
      ...boardRoutes,
      {
        path: '/board/all/search',
        element: <SearchPage />,
      },

      /* 이벤트 */
      {
        path: '/board/event',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'이벤트 게시판 접근 권한이 없어요'}
          >
            <EventListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `/board/event/notice`,
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'이벤트 게시판 접근 권한이 없어요'}
          >
            <NoticeListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/event-notice/post/:postId',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'공지글 접근 권한이 없어요'}
          >
            <PostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/event-notice/post/:postId/edit',
        element: (
          <ProtectedRoute
            roles={[ROLE.admin]}
            message={'공지글 수정 권한이 없어요'}
          >
            <EditPostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `/board/event/event-post-write`,
        element: (
          <ProtectedRoute
            roles={[ROLE.admin]}
            message={'게시글 작성 권한이 없어요'}
          >
            <WriteEventPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `/board/event/post/:postId/edit`,
        element: (
          <ProtectedRoute
            roles={[ROLE.admin]}
            message={'게시글 편집 권한이 없어요'}
          >
            <EditEventPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `/board/event/post/:postId`,
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'게시글 접근 권한이 없어요'}
          >
            <EventPage />
          </ProtectedRoute>
        ),
      },

      /* 시험후기 */
      {
        path: '/board/exam-review',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 접근 권한이 없어요'}
          >
            <NavbarLayout>
              <ExamReviewListPage />
            </NavbarLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: `/board/exam-review/notice`,
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 접근 권한이 없어요'}
          >
            <NoticeListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/exam-review/search',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 접근 권한이 없어요'}
          >
            <NavbarLayout>
              <ExamReviewListPage />
            </NavbarLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/exam-review/post/:postId',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 접근 권한이 없어요'}
          >
            <ExamReviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/exam-review-notice/post/:postId',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'공지글 접근 권한이 없어요'}
          >
            <PostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/exam-review-notice/post/:postId/edit',
        element: (
          <ProtectedRoute
            roles={[ROLE.admin]}
            message={'공지글 수정 권한이 없어요'}
          >
            <EditPostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/exam-review/:postId/edit',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 수정 권한이 없어요'}
          >
            <EditExamReviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/board/exam-review-write',
        element: (
          <CheckExamPeriodRoute>
            <ProtectedRoute
              roles={[ROLE.user, ROLE.admin]}
              message={'시험후기 작성 권한이 없어요'}
            >
              <WriteExamReviewPage />
            </ProtectedRoute>
          </CheckExamPeriodRoute>
        ),
      },

      /* 알림 */
      {
        path: '/alert',
        element: (
          <ProtectedRoute>
            <NavbarLayout>
              <AlertPage />
            </NavbarLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/alert/setting',
        element: (
          <ProtectedRoute>
            <AlertSettingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/terms/marketing',
        element: <MarketingTermsPage />,
      },
      {
        path: '/attendance',
        element: (
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        ),
        loader: attendanceLoader,
      },

      /* 문의 및 신고 */
      {
        path: 'inquiry',
        children: [
          {
            path: 'write',
            element: (
              <ProtectedRoute>
                <WriteInquiryPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':inquiryId',
            element: (
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':inquiryId/edit',
            element: (
              <ProtectedRoute>
                <EditInquiryPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'report',
        children: [
          {
            path: 'write',
            children: [
              { index: true, element: <NotFoundPage /> },
              {
                path: ':reportType',
                element: (
                  <ProtectedRoute>
                    <WriteReportPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: ':reportId',
            element: (
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':reportId/edit',
            element: (
              <ProtectedRoute>
                <EditReportPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      /* 마이페이지 */
      {
        path: '/my-page',
        element: (
          <ProtectedRoute>
            <NavbarLayout>
              <MyPage />
            </NavbarLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/password',
        element: (
          <ProtectedRoute>
            <ChangePwPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/edit-info',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/view-point-list',
        element: (
          <ProtectedRoute>
            <PointLogListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/delete-account',
        element: (
          <ProtectedRoute>
            <DeleteAccountPage />
          </ProtectedRoute>
        ),
      },

      {
        path: '/my-page/my-post',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/comment',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/download-exam-review',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/scrap',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-page/scrap-exam-review',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: '/my-page/inquiry-report',
      //   element: <FAQPage />,
      // },
      {
        path: '/my-page/faq',
        element: <FAQPage />,
      },
      {
        path: '/my-page/privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: '/my-page/service-policy',
        element: <ServicePolicyPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/verify',
        element: (
          <ProtectedRoute
            roles={[ROLE.preUser, ROLE.admin]}
            message='이미 인증을 완료했거나 인증 대상이 아니에요'
          >
            <SnoroseVerifyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/find-id',
        element: <FindIdPage />,
      },
      {
        path: '/find-pw',
        element: <FindPwPage />,
      },
      {
        path: '/found-id',
        element: <FoundIdPage />,
      },
      {
        path: '/found-pw',
        element: <FoundPwPage />,
      },
      {
        path: '/not-found-id',
        element: <NotFoundIdPage />,
      },
      {
        path: '/not-found-pw',
        element: <NotFoundPwPage />,
      },
      {
        path: '/signup',
        element: <SignUpPage />,
      },
      {
        path: '/signup/success',
        element: <SignUpSuccessPage />,
      },
      {
        path: '/signup/failure',
        element: <SignUpFailurePage />,
      },
      {
        path: '/maintenance',
        element: <MaintenancePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
