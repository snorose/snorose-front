import axios from 'axios';

const defaultAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

authAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let pendingQueue = [];

authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          pendingQueue.push({ resolve, reject })
        )
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authAxios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const newToken = await reissueAccessToken();

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      originalRequest._retry = true;

      return authAxios(originalRequest);
    }

    return Promise.reject(error);
  }
);

function processQueue({ error, token }) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  pendingQueue = [];
}

async function reissueAccessToken() {
  let newToken;
  isRefreshing = true;

  try {
    const response = await axios.post(
      '/v1/users/reissueToken',
      {},
      {
        baseURL: process.env.REACT_APP_SERVER_DOMAIN,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    newToken = response?.data.result.accessToken;

    localStorage.setItem('accessToken', newToken);
    processQueue({ token: newToken });
  } catch (refreshError) {
    localStorage.removeItem('accessToken');
    processQueue({ error: refreshError });

    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }

  return newToken;
}

export { authAxios, defaultAxios };
