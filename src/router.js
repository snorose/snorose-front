import { attendanceLoader } from '@/shared/loader';
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
  FAQPage,
  PrivacyPolicyPage,
  ServicePolicyPage,
} from '@/page/snorose';
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
        ROLE.advertiser,
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
    meta: {
      hideNav: true,
    },
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
    meta: {
      hideNav: true,
    },
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
    meta: {
      hideNav: true,
    },
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
    meta: {
      hideNav: true,
    },
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
    meta: {
      hideNav: true,
    },
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
    meta: {
      hideNav: true,
    },
  },
]);

export const routeList = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/home',
        element: <MainPage />,
      },
      {
        path: '/board',
        element: <BoardCategoryPage />,
      },
      ...boardRoutes,
      {
        path: '/board/all/search',
        element: <SearchPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/board/event',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin, ROLE.advertiser]}
            message={'이벤트 게시판 접근 권한이 없어요'}
          >
            <EventListPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: `/board/event/notice`,
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin, ROLE.advertiser]}
            message={'이벤트 게시판 접근 권한이 없어요'}
          >
            <NoticeListPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/board/event-notice/post/:postId',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin, ROLE.advertiser]}
            message={'공지글 접근 권한이 없어요'}
          >
            <PostPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
      },
      {
        path: `/board/event/post/:postId`,
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin, ROLE.advertiser]}
            message={'게시글 접근 권한이 없어요'}
          >
            <EventPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/board/exam-review',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 접근 권한이 없어요'}
          >
            <ExamReviewListPage />
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
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/board/exam-review/search',
        element: (
          <ProtectedRoute
            roles={[ROLE.user, ROLE.admin]}
            message={'시험후기 접근 권한이 없어요'}
          >
            <ExamReviewListPage />
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
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/alert',
        element: (
          <ProtectedRoute>
            <AlertPage />
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
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/attendance',
        element: <AttendancePage />,
        loader: attendanceLoader,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page',
        element: (
          <ProtectedRoute>
            <MyPage />
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
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/edit-info',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/view-point-list',
        element: (
          <ProtectedRoute>
            <PointLogListPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/delete-account',
        element: (
          <ProtectedRoute>
            <DeleteAccountPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/faq',
        element: <FAQPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/privacy-policy',
        element: <PrivacyPolicyPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/service-policy',
        element: <ServicePolicyPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/my-post',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/comment',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/download-exam-review',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/scrap',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/my-page/scrap-exam-review',
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/about',
        element: <AboutPage />,
        meta: {
          hideNav: true,
        },
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
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/login',
        element: <LoginPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/find-id',
        element: <FindIdPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/find-pw',
        element: <FindPwPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/found-id',
        element: <FoundIdPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/found-pw',
        element: <FoundPwPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/not-found-id',
        element: <NotFoundIdPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/not-found-pw',
        element: <NotFoundPwPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/signup',
        element: <SignUpPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/signup/success',
        element: <SignUpSuccessPage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/signup/failure',
        element: <SignUpFailurePage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '/maintenance',
        element: <MaintenancePage />,
        meta: {
          hideNav: true,
        },
      },
      {
        path: '*',
        element: <NotFoundPage />,
        meta: {
          hideNav: true,
        },
      },
    ],
  },
];
