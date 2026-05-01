import { json, LoaderFunctionArgs } from 'react-router-dom';

import { readInquiry, readReport } from '@/feature/support/api';
import { REPORT_PARAMS_SCHEMA, ReportType } from '@/feature/support/data';

export function validateReportWriteLoader({ params }: LoaderFunctionArgs) {
  const { reportType } = params;

  if (!(reportType in REPORT_PARAMS_SCHEMA)) {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    reportType: reportType as ReportType,
  };
}

export const inquiryEditLoader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;

  try {
    const post = await readInquiry(postId);

    if (post.status === 'COMPLETED') {
      throw json({ code: 6102 }, { status: 403 });
    }

    return post;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    const status = error.response?.status;
    const code = error.response?.data?.code;

    switch (status) {
      case 403:
        throw json({ code }, { status: 403 });
      case 404:
        throw new Response('Not Found', { status: 404 });
      default:
        throw new Response('Internal Server Error', { status: 500 });
    }
  }
};

export const reportEditLoader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;

  try {
    const post = await readReport(postId);

    if (post.status === 'COMPLETED') {
      throw json({ code: 6102 }, { status: 403 });
    }

    return post;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    const status = error.response?.status;
    const code = error.response?.data?.code;

    switch (status) {
      case 403:
        throw json({ code }, { status: 403 });
      case 404:
        throw new Response('Not Found', { status: 404 });
      default:
        throw new Response('Internal Server Error', { status: 500 });
    }
  }
};
