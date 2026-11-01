import { authAxios } from '@/axios';

type FAQ = {
  faqId: number;
  faqCategory: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string | null;
};

export const fetchFAQs = async (category: string): Promise<Array<FAQ>> => {
  const response = await authAxios.get(`/v1/support/faq`, {
    params: {
      category,
    },
  });

  return response.data.result.data;
};
