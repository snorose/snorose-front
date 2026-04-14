import { defaultAxios } from '@/axios';

import { useToast } from '@/shared/hook';
import { TOAST } from '@/shared/constant';

const LOGIN_ERROR_MAP = {
  '아이디 또는 비밀번호가 틀립니다.': '아이디 혹은 비밀번호가 일치하지 않아요',
};

export const useLogin = () => {
  const { toast } = useToast();
  const login = async (e, setIsError, formData, navigate, setErrorMessage) => {
    e.preventDefault();

    setIsError(false);
    setErrorMessage('');

    const endpoint = '/v1/users/login';

    if (!formData.loginId) {
      toast({ message: TOAST.LOGIN.emptyId, variant: 'info' });
    } else if (!formData.password) {
      toast({ message: TOAST.LOGIN.emptyPw, variant: 'info' });
    } else {
      try {
        const response = await defaultAxios.post(endpoint, formData);
        const { accessToken, refreshToken } =
          response?.data.result.tokenResponse;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setIsError(false);
        setErrorMessage('');
        navigate('/');
        window.location.reload();
      } catch (e) {
          const status = e.response?.status;
          const serverMsg = e.response?.data?.message || '네트워크 연결 상태를 확인해주세요.';

        if (status === 500) {
          toast({ message: TOAST.ERROR.SERVER, variant: 'error' });
        } else {
          setErrorMessage(LOGIN_ERROR_MAP[serverMsg] ?? serverMsg);
        }
        setIsError(true);
      }
    }
  };

  return login;
};

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
