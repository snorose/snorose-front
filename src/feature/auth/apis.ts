import { authAxios, defaultAxios } from '@/axios';

type LoginResponse = {
  tokenResponse: {
    grantType: 'Bearer';
    accessToken: string;
  };
  encryptedUserId: string;
  nickname: string;
  balance: number;
  userRoleId: number;
  birthday: string;
};

export async function login({
  loginId,
  password,
}: {
  loginId: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await defaultAxios.post(
    '/v2/users/login',
    {
      loginId,
      password,
    },
    { withCredentials: true }
  );

  return response.data.result;
}

export async function logout() {
  const response = await authAxios.post('/v2/users/logout');

  return response.data;
}
