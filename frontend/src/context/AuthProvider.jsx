import { createContext, useEffect, useLayoutEffect, useState } from 'react';
import propTypes from 'prop-types';
import axiosInstance from '@/utils/axiosInstance';

export const AuthContext = createContext({});

let runningPromise = undefined;
let refreshCalled = false;

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ accessToken: undefined });

  const refreshToken = () => {
    if (refreshCalled) {
      return runningPromise;
    } else {
      refreshCalled = true;
      runningPromise = axiosInstance.post('/refresh').finally(() => {
        refreshCalled = false;
      });
      return runningPromise;
    }
  };

  useEffect(() => {
    const initialRefresh = async () => {
      try {
        const response = await refreshToken();
        const newAuth = response.data;
        setAuth(newAuth);
      } catch {
        setAuth({ accessToken: null });
      }
    };

    initialRefresh();
    const interval = setInterval(initialRefresh, 15 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && auth.accessToken
          ? `Bearer ${auth.accessToken}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [auth?.accessToken]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log(error);
        if (
          error.response.status === 401 &&
          error.response.data.message === 'Unauthorized'
        ) {
          try {
            const response = await refreshToken();

            setAuth(response.data);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return axiosInstance(originalRequest);
          } catch {
            setAuth({ accessToken: null });
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: propTypes.any,
};

export default AuthProvider;
