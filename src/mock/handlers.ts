import { inquiryHandlers } from './handler/inquiry';
import { reportHandlers } from './handler/report';

export const handlers = [...inquiryHandlers, ...reportHandlers];
