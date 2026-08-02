import axios from 'axios';

const REFRESH_TOKEN_EXPIRED_CODE = 2704;

export function activateSession(accessToken: string) {
  localStorage.setItem('accessToken', accessToken);
  resetSessionExpiredHandling();
}

let isSessionExpiredHandled = false;

export function resetSessionExpiredHandling() {
  isSessionExpiredHandled = false;
}

export function shouldHandleSessionExpired() {
  if (isSessionExpiredHandled) return false;

  isSessionExpiredHandled = true;
  return true;
}

export function clearAuthTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function isRefreshTokenExpiredError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    Number(error.response?.data?.code) === REFRESH_TOKEN_EXPIRED_CODE
  );
}
