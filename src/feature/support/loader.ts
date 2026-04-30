import { json, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { readInquiry } from '@/feature/support/api';
import { REPORT_PARAMS_SCHEMA, ReportType } from '@/feature/support/data';
import type { ReportDTO } from '@/feature/support/types';

export type ReportParamsLoaderData = Awaited<
  ReturnType<typeof validateReportWriteLoader>
>;

export function validateReportWriteLoader({
  params,
  request,
}: LoaderFunctionArgs) {
  const { reportType } = params;
  const url = new URL(request.url);

  validateReportWriteParams(reportType, url.searchParams);

  return {
    reportType: reportType as ReportType,
    reportParams: Object.fromEntries(url.searchParams),
  };
}

function validateReportWriteParams(type: string, params: URLSearchParams) {
  if (!(type in REPORT_PARAMS_SCHEMA)) {
    throw new Response('Not Found', { status: 404 });
  }

  const schema = REPORT_PARAMS_SCHEMA[type as ReportType];
  const missing = [...schema].filter((key) => !params.get(key));

  if (missing.length > 0) {
    throw redirect('/');
  }
}

export const inquiryEditLoader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;

  try {
    const post = await readInquiry(postId);

    return post;
  } catch (error) {
    switch (error.response.status) {
      case 403:
        throw json({ code: error.response?.data?.code }, { status: 403 });
      case 404:
        throw new Response('Not Found', { status: 404 });
      default:
        throw new Response('Internal Server Error', { status: 500 });
    }
  }
};

/**
 * TODO:
 * - 존재하지 않는 reportId로 접근 시 404 처리
 * - 권한이 없는 reportId로 접근 시 403 처리
 * - 처리 완료 후에는 접근 불가
 */

export const reportEditLoader = async ({ params }: LoaderFunctionArgs) => {
  const { reportId } = params;

  // const result = await fetch(`/v1/report/${reportId}`);

  const post: ReportDTO = {
    reportId: 15,
    userRoleId: 4,
    isWriter: true,
    userId: '629j3YCdF2F+NPCBzMf0Rg==',
    userDisplay: '눈송',
    title: '댓글 신고',
    content: '댓글 신고 내용~~~~~',
    reportType: 'COMMENT_REPORT',
    category: 'COMMENT_PERSONAL_DATA_LEAK',
    status: 'PENDING',
    commentCount: 0,
    createdAt: '2026-02-16T22:47:09.234619',
    isEdited: false,
    isWriterWithdrawn: false,
    attachments: [],
  };

  return post;
};
