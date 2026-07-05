import { TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { defaultAxios } from '@/axios';

export const useFindId = () => {
  const { toast } = useToast();
  const findId = async (e, formData, navigate, setLoading) => {
    e.preventDefault();
    const endpoint = '/v1/users/findid';

    if (formData.userName && formData.studentNumber) {
      try {
        //로딩중인지 아닌지 확인하는 setLoading
        setLoading(true);
        const response = await defaultAxios.post(endpoint, formData);
        setLoading(false);
        navigate('/found-id', {
          state: { email: response.data.result },
        });
      } catch (e) {
        setLoading(false);
        const status = e.response?.status;
        if (status === 500) {
          toast({ message: TOAST.ERROR.SERVER, variant: 'error' });
        } else {
          navigate('/not-found-id', { state: { access: true } });
        }
      }
    }
  };
  return findId;
};

export const useFindPw = () => {
  const { toast } = useToast();
  const findPw = async (e, formData, navigate, setLoading) => {
    e.preventDefault();
    const endpoint = '/v1/users/findPW';

    if (formData.loginId && formData.email) {
      try {
        setLoading(true);
        await defaultAxios.post(endpoint, formData);
        setLoading(false);

        navigate('/found-pw', {
          state: { email: formData.email },
        });
      } catch (e) {
        setLoading(false);
        const status = e.response?.status;
        if (status === 500) {
          toast({ message: TOAST.ERROR.SERVER, variant: 'error' });
        } else {
          navigate('/not-found-pw', { state: { access: true } });
        }
      }
    }
  };
  return findPw;
};
